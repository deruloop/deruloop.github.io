// Marks a paragraph as a figure caption when it is wholly italic and sits right
// under a table, a code block (diagrams included), a lone image, or a lone link
// to an .mp4 (which the article page renders as a video):
//
//   | a | b |          ```mermaid          ![alt](/blog/x.png)
//   |---|---|          ...
//   | 1 | 2 |          ```                 *The caption.*
//
//   *The caption.*     *The caption.*
//
// The Markdown stays plain for anyone reading the raw file; the site styles it.
interface Node {
  type: string;
  url?: string;
  children?: Node[];
  data?: { hProperties?: Record<string, unknown> };
}

const isLoneImage = (node: Node) =>
  node.type === "paragraph" && node.children?.length === 1 && node.children[0].type === "image";

const isLoneVideo = (node: Node) =>
  node.type === "paragraph" &&
  node.children?.length === 1 &&
  node.children[0].type === "link" &&
  /\.mp4$/i.test(node.children[0].url ?? "");

const isFigure = (node: Node) =>
  node.type === "table" || node.type === "code" || isLoneImage(node) || isLoneVideo(node);

const isCaption = (node: Node) =>
  node.type === "paragraph" && node.children?.length === 1 && node.children[0].type === "emphasis";

export default function remarkFigureCaptions() {
  return (tree: Node) => {
    const children = tree.children ?? [];
    for (let i = 1; i < children.length; i++) {
      if (isCaption(children[i]) && isFigure(children[i - 1])) {
        children[i].data = { ...children[i].data, hProperties: { className: "figure-caption" } };
      }
    }
  };
}
