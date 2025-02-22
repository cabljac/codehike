import React from "react"
import { CodeAnnotation } from "@code-hike/smooth-code"

export function Annotation() {
  return "error: code hike remark plugin not running or annotation isn't at the right place"
}

export const annotationsMap: Record<
  string,
  CodeAnnotation["Component"]
> = {
  box: Box,
  bg: Background,
  label: Label,
  link: CodeLink,
}

function Box({
  children,
  data,
  theme,
}: {
  data: any
  children: React.ReactNode
  theme: any
}) {
  const border =
    typeof data === "string"
      ? data
      : theme.tokenColors.find((tc: any) =>
          tc.scope?.includes("string")
        )?.settings?.foreground || "yellow"
  return (
    <span
      className="ch-code-box-annotation"
      style={{ outline: `2px solid ${border}` }}
    >
      {children}
    </span>
  )
}

function Background({
  children,
  data,
  style,
  theme,
}: {
  data: string
  children: React.ReactNode
  style?: React.CSSProperties
  theme?: any
}) {
  const bg =
    data ||
    (((theme as any).colors[
      "editor.lineHighlightBackground"
    ] ||
      (theme as any).colors[
        "editor.selectionHighlightBackground"
      ]) as string)
  return (
    <div
      style={{
        ...style,
        background: bg,
        // cursor: "pointer",
      }}
      className="ch-code-bg-annotation"
    >
      <span
        className="ch-code-bg-annotation-border"
        style={{
          background: "#00a2d3",
          width: "3px",
          height: "100%",
          position: "absolute",
          left: 0,
        }}
      />
      {children}
    </div>
  )
}

function Label({
  children,
  data,
  style,
  theme,
}: {
  data: any
  children: React.ReactNode
  style?: React.CSSProperties
  theme?: any
}) {
  const bg = ((theme as any).colors[
    "editor.lineHighlightBackground"
  ] ||
    (theme as any).colors[
      "editor.selectionHighlightBackground"
    ]) as string
  const [hover, setHover] = React.useState(false)

  return (
    <div
      style={{
        ...style,
        background: hover ? bg : undefined,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
      <div
        style={{
          position: "absolute",
          right: 0,
          paddingRight: 16,
          display: hover ? "block" : "none",
          opacity: 0.7,
        }}
      >
        {data?.children || data}
      </div>
    </div>
  )
}

function CodeLink({
  children,
  data,
}: {
  data:
    | {
        url: string
        title: string | undefined
      }
    | string
  children: React.ReactNode
}) {
  const url = (data as any)?.url || data
  const title = (data as any)?.title
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      style={{
        textDecoration: "underline",
        textDecorationStyle: "dotted",
        color: "inherit",
      }}
    >
      {children}
    </a>
  )
}
