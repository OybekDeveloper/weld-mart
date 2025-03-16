"use client";

import { useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Toolbar from "./Toolbar";

const Tiptap = ({ onChange, content }) => {
  // Memoize the handleChange function
  const handleChange = useCallback((newContent) => {
    onChange(newContent);
  }, [onChange]);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: content || "<p>Введите характеристики...</p>",
    editorProps: {
      attributes: {
        class:
          "flex flex-col px-4 py-3 justify-start border-b border-r border-l border-gray-200 items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-bl-md rounded-br-md outline-none min-h-[200px]",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      handleChange(html);
    },
    immediatelyRender: false,
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "<p>Введите характеристики...</p>");
    }
  }, [content, editor]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full border border-gray-200 rounded-md">
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        style={{ whiteSpace: "pre-wrap", minHeight: "200px" }}
      />
    </div>
  );
};

export default Tiptap;