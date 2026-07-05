import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextAlign } from "@tiptap/extension-text-align";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";

/**
 * Shared between the admin editor (client) and the server-side HTML
 * renderer (`generateHTML` in src/lib/models/Post.ts) so stored JSON always
 * renders identically. Link/Underline come bundled in Tiptap v3's
 * StarterKit — don't re-register them separately or Tiptap warns about
 * duplicate extension names.
 */
export function buildTiptapExtensions() {
  return [
    StarterKit.configure({
      link: {
        openOnClick: false,
        autolink: true,
      },
    }),
    Placeholder.configure({
      placeholder: "Start writing your post…",
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    Image.configure({
      inline: false,
      allowBase64: false,
    }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    TaskList,
    TaskItem.configure({ nested: true }),
  ];
}
