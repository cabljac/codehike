import { Node, Parent } from "unist"
import visit from "unist-util-visit"
import { valueToEstree } from "./to-estree"

export type NodeInfo = {
  node: Node
  index: number
  parent: Parent
}

export function splitChildren(
  parent: Parent,
  type: string
) {
  const splits = [] as NodeInfo[][]
  let i = 0
  parent.children.forEach((node, index) => {
    if (node.type === type) {
      i++
    } else {
      if (!splits[i]) {
        splits[i] = []
      }
      splits[i].push({ node, index, parent })
    }
  })
  return splits
}

export async function visitAsync(
  tree: Node,
  type: string | string[],
  visitor: (
    node: Node,
    index: number,
    parent: Parent | undefined
  ) => void | Promise<any>
) {
  const promises = [] as Promise<any>[]
  visit(tree, type, (node, index, parent) => {
    const result = visitor(node, index, parent)
    if (result) {
      promises.push(result)
    }
  })
  await Promise.all(promises)
}

export const CH_CODE_CONFIG_PLACEHOLDER = "CH_CodeConfig" as any
export const CH_CODE_CONFIG_VAR_NAME = "chCodeConfig"

export function toJSX(
  node: Node,
  {
    type = "mdxJsxFlowElement",
    props,
    name,
    appendProps = false,
  }: {
    type?: string
    props: Record<string, any>
    name?: string
    appendProps?: boolean
  }
) {
  // console.log(`transforming ${node.name} to ${name}`)
  node.type = type
  if (name) {
    node.name = name
  }
  if (!appendProps) {
    node.attributes = []
  }

  Object.keys(props).forEach(key => {
    if (props[key] === undefined) {
      return
    }
    if (props[key] === CH_CODE_CONFIG_PLACEHOLDER) {
      ;(node as any).attributes.push({
        type: "mdxJsxAttribute",
        name: key,
        value: {
          type: "mdxJsxAttributeValueExpression",
          value: CH_CODE_CONFIG_VAR_NAME,
          data: {
            estree: {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "Identifier",
                    name: CH_CODE_CONFIG_VAR_NAME,
                  },
                },
              ],
              sourceType: "module",
            },
          },
        },
      })
    } else {
      ;(node as any).attributes.push({
        type: "mdxJsxAttribute",
        name: key,
        value: {
          type: "mdxJsxAttributeValueExpression",
          value: JSON.stringify(props[key]),
          data: {
            estree: {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: valueToEstree(props[key]),
                },
              ],
              sourceType: "module",
            },
          },
        },
      })
    }
  })
}
