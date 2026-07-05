"use client";

import { useCallback, useEffect, useRef } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import { CharacterCount } from "@tiptap/extension-character-count";
import { buildTiptapExtensions } from "@/lib/tiptap-extensions";

interface Props {
  value: any;
  onChange: (json: any) => void;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()} // keep editor selection/focus
      onClick={onClick}
      className={`rounded px-2 py-1 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
        active
          ? "bg-accent text-ink-950"
          : "text-cream-50/70 hover:bg-ink-800 hover:text-cream-50"
      }`}
    >
      {label}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const presignRes = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, contentType: file.type, folder: "blog" }),
    });
    if (!presignRes.ok) return;
    const { uploadUrl, publicUrl } = await presignRes.json();

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!uploadRes.ok) return;

    editor.chain().focus().setImage({ src: publicUrl }).run();
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-white/10 bg-ink-900 p-2">
      <ToolbarButton
        title="Heading 1"
        label="H1"
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      />
      <ToolbarButton
        title="Heading 2"
        label="H2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <ToolbarButton
        title="Heading 3"
        label="H3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      />
      <span className="mx-1 h-5 w-px bg-white/10" />
      <ToolbarButton
        title="Bold"
        label="B"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        title="Italic"
        label="I"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        title="Underline"
        label="U"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <ToolbarButton
        title="Strikethrough"
        label="S"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />
      <span className="mx-1 h-5 w-px bg-white/10" />
      <ToolbarButton
        title="Align left"
        label="⇤"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      />
      <ToolbarButton
        title="Align center"
        label="↔"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      />
      <ToolbarButton
        title="Align right"
        label="⇥"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      />
      <span className="mx-1 h-5 w-px bg-white/10" />
      <ToolbarButton
        title="Bullet list"
        label="• List"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        title="Numbered list"
        label="1. List"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <ToolbarButton
        title="Task list"
        label="☑ Task"
        active={editor.isActive("taskList")}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
      />
      <span className="mx-1 h-5 w-px bg-white/10" />
      <ToolbarButton
        title="Quote"
        label="❝"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <ToolbarButton
        title="Code block"
        label="</>"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      />
      <ToolbarButton
        title="Horizontal rule"
        label="―"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      />
      <span className="mx-1 h-5 w-px bg-white/10" />
      <ToolbarButton
        title="Link"
        label="🔗"
        active={editor.isActive("link")}
        onClick={setLink}
      />
      <ToolbarButton
        title="Insert image"
        label="🖼"
        onClick={() => fileInputRef.current?.click()}
      />
      <ToolbarButton
        title="Insert table"
        label="⊞"
        onClick={() =>
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
      />
      <span className="mx-1 h-5 w-px bg-white/10" />
      <ToolbarButton
        title="Undo"
        label="↺"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      />
      <ToolbarButton
        title="Redo"
        label="↻"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFile}
      />
    </div>
  );
}

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [...buildTiptapExtensions(), CharacterCount],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose-editor min-h-[320px] max-w-none px-4 py-3 text-cream-50 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
  });

  // Keep the editor in sync if the parent form loads/resets the value
  // (e.g. when navigating between edit pages) without recreating the editor.
  useEffect(() => {
    if (!editor) return;
    const current = JSON.stringify(editor.getJSON());
    const next = JSON.stringify(value || {});
    if (current !== next && value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, value]);

  if (!editor) return null;

  const words = editor.storage.characterCount?.words?.() ?? 0;
  const characters = editor.storage.characterCount?.characters?.() ?? 0;

  return (
    <div className="overflow-hidden rounded-md border border-white/10 bg-ink-950">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      <div className="flex justify-end gap-4 border-t border-white/10 px-4 py-2 text-xs text-cream-50/40">
        <span>{words} words</span>
        <span>{characters} characters</span>
      </div>
    </div>
  );
}
