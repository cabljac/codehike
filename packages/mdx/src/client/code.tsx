import React from "react"
import { CodeSpring } from "@code-hike/smooth-code"
import {
  EditorSpring,
  EditorProps,
  EditorStep,
} from "@code-hike/mini-editor"

export function Code(props: EditorProps) {
  const [step, setStep] = React.useState(props)

  function onTabClick(filename: string) {
    const newStep = updateEditorStep(step, filename, null)
    setStep({ ...step, ...newStep })
  }

  return <InnerCode {...step} onTabClick={onTabClick} />
}

export function InnerCode({
  onTabClick,
  ...props
}: EditorProps & {
  onTabClick?: (filename: string) => void
}) {
  if (
    !props.southPanel &&
    props.files.length === 1 &&
    !props.files[0].name
  ) {
    return (
      <CodeSpring
        className="ch-code"
        config={props.codeConfig}
        step={props.files[0]}
      />
    )
  } else {
    const frameProps = {
      ...props?.frameProps,
      onTabClick,
    }
    return (
      <EditorSpring {...props} frameProps={frameProps} />
    )
  }
}

export function updateEditorStep(
  step: EditorStep,
  filename: string | undefined,
  focus: string | null
): EditorStep {
  const name = filename || step.northPanel.active
  const newFiles = step.files.map((file: any) =>
    file.name === name
      ? {
          ...file,
          focus: focus === null ? file.focus : focus,
        }
      : file
  )

  let northPanel = { ...step.northPanel }
  let southPanel = step.southPanel && {
    ...step.southPanel,
  }
  if (step.northPanel.tabs.includes(name)) {
    northPanel.active = name
  } else if (southPanel) {
    southPanel.active = name
  }
  return { files: newFiles, northPanel, southPanel }
}
