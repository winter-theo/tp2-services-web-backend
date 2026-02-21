import { Extension, Node } from "@tiptap/core";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";

const FONT_FAMILIES = [
  { label: "System", value: "" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Courier", value: "\"Courier New\", monospace" },
];

const FONT_SIZES = [
  { label: "14", value: "14px" },
  { label: "16", value: "16px" },
  { label: "18", value: "18px" },
  { label: "24", value: "24px" },
  { label: "32", value: "32px" },
];

const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const STYLE_TAG_REGEX = /<style\b[^>]*>[\s\S]*?<\/style>/gi;

const safeColorValue = (value, fallback) => {
  if (typeof value !== "string") {
    return fallback;
  }
  return HEX_COLOR.test(value) ? value : fallback;
};

const extractStylesAndContent = (html) => {
  const rawHtml = typeof html === "string" ? html : "";
  const styleBlocks = rawHtml.match(STYLE_TAG_REGEX) || [];
  const styles = styleBlocks.join("\n");
  const content = rawHtml.replace(STYLE_TAG_REGEX, "");
  return { styles, content };
};

const mergeStylesAndContent = (styles, content) => {
  const stylePart = (styles || "").trim();
  const contentPart = (content || "").trim();
  if (stylePart && contentPart) {
    return `${stylePart}\n${contentPart}`;
  }
  return stylePart || contentPart;
};

const htmlAttr = (element, name) => element.getAttribute(name) || null;

const TemplateContainer = Node.create({
  name: "templateContainer",
  group: "block",
  content: "block*",
  defining: true,
  addAttributes() {
    return {
      tag: {
        default: "div",
        parseHTML: (element) => element.tagName.toLowerCase(),
      },
      class: {
        default: null,
        parseHTML: (element) => htmlAttr(element, "class"),
      },
      id: {
        default: null,
        parseHTML: (element) => htmlAttr(element, "id"),
      },
      style: {
        default: null,
        parseHTML: (element) => htmlAttr(element, "style"),
      },
      dataArticleSlug: {
        default: null,
        parseHTML: (element) => htmlAttr(element, "data-article-slug"),
      },
      dataFishRefs: {
        default: null,
        parseHTML: (element) => htmlAttr(element, "data-fish-refs"),
      },
      dataFishSlug: {
        default: null,
        parseHTML: (element) => htmlAttr(element, "data-fish-slug"),
      },
      dataScientificName: {
        default: null,
        parseHTML: (element) => htmlAttr(element, "data-scientific-name"),
      },
      dataTags: {
        default: null,
        parseHTML: (element) => htmlAttr(element, "data-tags"),
      },
    };
  },
  parseHTML() {
    return [
      { tag: "article" },
      { tag: "header" },
      { tag: "section" },
      { tag: "div" },
      { tag: "aside" },
      { tag: "main" },
      { tag: "footer" },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    const tag = HTMLAttributes.tag || "div";
    const attrs = {
      class: HTMLAttributes.class || undefined,
      id: HTMLAttributes.id || undefined,
      style: HTMLAttributes.style || undefined,
      "data-article-slug": HTMLAttributes.dataArticleSlug || undefined,
      "data-fish-refs": HTMLAttributes.dataFishRefs || undefined,
      "data-fish-slug": HTMLAttributes.dataFishSlug || undefined,
      "data-scientific-name": HTMLAttributes.dataScientificName || undefined,
      "data-tags": HTMLAttributes.dataTags || undefined,
    };
    return [tag, attrs, 0];
  },
});

const RichParagraph = Paragraph.extend({
  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (element) => htmlAttr(element, "class"),
        renderHTML: (attributes) => (attributes.class ? { class: attributes.class } : {}),
      },
      style: {
        default: null,
        parseHTML: (element) => htmlAttr(element, "style"),
        renderHTML: (attributes) => (attributes.style ? { style: attributes.style } : {}),
      },
    };
  },
});

const RichHeading = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: (element) => htmlAttr(element, "class"),
        renderHTML: (attributes) => (attributes.class ? { class: attributes.class } : {}),
      },
      style: {
        default: null,
        parseHTML: (element) => htmlAttr(element, "style"),
        renderHTML: (attributes) => (attributes.style ? { style: attributes.style } : {}),
      },
    };
  },
});

const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize: null }).run();
        },
    };
  },
});

function ToolbarButton({ onClick, label, active, disabled }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={active ? "active" : ""}>
      {label}
    </button>
  );
}

export default function TiptapEditor({ value, onChange, placeholder = "Saisir du texte..." }) {
  const [sourceMode, setSourceMode] = useState(false);
  const initialSplit = extractStylesAndContent(value || "");
  const [sourceValue, setSourceValue] = useState(mergeStylesAndContent(initialSplit.styles, initialSplit.content));
  const [preservedStyles, setPreservedStyles] = useState(initialSplit.styles);
  const preservedStylesRef = useRef(initialSplit.styles);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: false,
        heading: false,
      }),
      TemplateContainer,
      RichParagraph,
      RichHeading.configure({ levels: [1, 2, 3] }),
      TextStyle,
      FontSize,
      Color,
      FontFamily,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Image.configure({
        allowBase64: true,
        inline: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: initialSplit.content,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(mergeStylesAndContent(preservedStylesRef.current, currentEditor.getHTML()));
    },
    editorProps: {
      attributes: {
        class: "tiptap-content",
      },
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }
    const { styles, content } = extractStylesAndContent(value || "");
    preservedStylesRef.current = styles;
    setPreservedStyles(styles);
    if (editor.getHTML() !== content) {
      editor.commands.setContent(content, false);
    }
    if (!sourceMode) {
      setSourceValue(mergeStylesAndContent(styles, content));
    }
  }, [editor, value, sourceMode]);

  if (!editor) {
    return null;
  }

  const textStyleAttrs = editor.getAttributes("textStyle");
  const currentFontSize = textStyleAttrs.fontSize || "";
  const currentFontFamily = textStyleAttrs.fontFamily || "";
  const currentColor = safeColorValue(textStyleAttrs.color, "#1f2937");
  const currentHighlight = safeColorValue(editor.getAttributes("highlight").color, "#fef08a");

  const setLink = () => {
    const current = editor.getAttributes("link").href || "";
    const url = window.prompt("Entrer l'URL", current);

    if (url === null) {
      return;
    }

    if (url.trim() === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: url.trim() }).run();
  };

  const addImage = () => {
    const src = window.prompt("URL de l'image");
    if (!src || !src.trim()) {
      return;
    }

    const alt = window.prompt("Texte alternatif (alt)", "") || "";
    editor.chain().focus().setImage({ src: src.trim(), alt }).run();
  };

  const onFontSizeChange = (fontSize) => {
    if (!fontSize) {
      editor.chain().focus().unsetFontSize().run();
      return;
    }
    editor.chain().focus().setFontSize(fontSize).run();
  };

  const onFontFamilyChange = (fontFamily) => {
    if (!fontFamily) {
      editor.chain().focus().unsetFontFamily().run();
      return;
    }
    editor.chain().focus().setFontFamily(fontFamily).run();
  };

  const toggleSourceMode = () => {
    if (!editor) {
      return;
    }

    if (sourceMode) {
      const { styles, content } = extractStylesAndContent(sourceValue || "");
      preservedStylesRef.current = styles;
      setPreservedStyles(styles);
      editor.commands.setContent(content, false);
      onChange(mergeStylesAndContent(styles, content));
      setSourceMode(false);
      return;
    }

    setSourceValue(mergeStylesAndContent(preservedStyles, editor.getHTML()));
    setSourceMode(true);
  };

  return (
    <div className="rte">
      <div className="rte-toolbar">
        <div className="rte-group">
          <select
            className="rte-select"
            value={currentFontFamily}
            onChange={(e) => onFontFamilyChange(e.target.value)}
          >
            {FONT_FAMILIES.map((family) => (
              <option key={family.label} value={family.value}>
                {family.label}
              </option>
            ))}
          </select>
          <select
            className="rte-select"
            value={currentFontSize}
            onChange={(e) => onFontSizeChange(e.target.value)}
          >
            <option value="">Size</option>
            {FONT_SIZES.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
        </div>

        <div className="rte-group">
          <ToolbarButton
            label="B"
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
          />
          <ToolbarButton
            label="I"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
          />
          <ToolbarButton
            label="U"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
          />
        </div>

        <div className="rte-group">
          <label className="rte-color-label">
            Text
            <input
              type="color"
              className="rte-color"
              value={currentColor}
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            />
          </label>
          <label className="rte-color-label">
            Mark
            <input
              type="color"
              className="rte-color"
              value={currentHighlight}
              onChange={(e) => editor.chain().focus().setHighlight({ color: e.target.value }).run()}
            />
          </label>
        </div>

        <div className="rte-group">
          <ToolbarButton
            label="H2"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive("heading", { level: 2 })}
          />
          <ToolbarButton
            label="H3"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive("heading", { level: 3 })}
          />
          <ToolbarButton
            label="UL"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
          />
          <ToolbarButton
            label="OL"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
          />
          <ToolbarButton
            label="Quote"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
          />
          <ToolbarButton
            label="Code"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive("codeBlock")}
          />
        </div>

        <div className="rte-group">
          <ToolbarButton
            label="L"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
          />
          <ToolbarButton
            label="C"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
          />
          <ToolbarButton
            label="R"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
          />
          <ToolbarButton
            label="J"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            active={editor.isActive({ textAlign: "justify" })}
          />
        </div>

        <div className="rte-group">
          <ToolbarButton label="Link" onClick={setLink} active={editor.isActive("link")} />
          <ToolbarButton label="Img" onClick={addImage} />
          <ToolbarButton
            label="Clear"
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          />
          <ToolbarButton
            label="Undo"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
          />
          <ToolbarButton
            label="Redo"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
          />
          <ToolbarButton label="HTML" onClick={toggleSourceMode} active={sourceMode} />
        </div>
      </div>
      {sourceMode ? (
        <textarea
          className="rte-source"
          value={sourceValue}
          onChange={(e) => setSourceValue(e.target.value)}
          spellCheck={false}
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
}
