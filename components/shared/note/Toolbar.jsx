"use client";

import React from "react";
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Underline,
  Quote,
  Undo,
  Redo,
  Code,
} from "lucide-react";

const Toolbar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const buttonClass = "p-2 rounded-lg hover:bg-gray-100 transition-colors";
  const activeClass = "bg-primary text-white";
  const inactiveClass = "text-gray-600";

  return (
    <div className="px-4 py-2 rounded-tl-md rounded-tr-md flex flex-wrap gap-2 border-b border-gray-200 bg-gray-50">
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        className={`${buttonClass} ${
          editor.isActive("bold") ? activeClass : inactiveClass
        }`}
        title="Жирный"
      >
        <Bold className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        className={`${buttonClass} ${
          editor.isActive("italic") ? activeClass : inactiveClass
        }`}
        title="Курсив"
      >
        <Italic className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleUnderline().run();
        }}
        className={`${buttonClass} ${
          editor.isActive("underline") ? activeClass : inactiveClass
        }`}
        title="Подчеркнутый"
      >
        <Underline className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleStrike().run();
        }}
        className={`${buttonClass} ${
          editor.isActive("strike") ? activeClass : inactiveClass
        }`}
        title="Зачеркнутый"
      >
        <Strikethrough className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
        className={`${buttonClass} ${
          editor.isActive("heading", { level: 2 }) ? activeClass : inactiveClass
        }`}
        title="Заголовок 2"
      >
        <Heading2 className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBulletList().run();
        }}
        className={`${buttonClass} ${
          editor.isActive("bulletList") ? activeClass : inactiveClass
        }`}
        title="Маркированный список"
      >
        <List className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleOrderedList().run();
        }}
        className={`${buttonClass} ${
          editor.isActive("orderedList") ? activeClass : inactiveClass
        }`}
        title="Нумерованный список"
      >
        <ListOrdered className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBlockquote().run();
        }}
        className={`${buttonClass} ${
          editor.isActive("blockquote") ? activeClass : inactiveClass
        }`}
        title="Цитата"
      >
        <Quote className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleCode().run();
        }}
        className={`${buttonClass} ${
          editor.isActive("code") ? activeClass : inactiveClass
        }`}
        title="Код"
      >
        <Code className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().undo().run();
        }}
        disabled={!editor.can().undo()}
        className={`${buttonClass} ${
          editor.can().undo() ? inactiveClass : "text-gray-300 cursor-not-allowed"
        }`}
        title="Отменить"
      >
        <Undo className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().redo().run();
        }}
        disabled={!editor.can().redo()}
        className={`${buttonClass} ${
          editor.can().redo() ? inactiveClass : "text-gray-300 cursor-not-allowed"
        }`}
        title="Повторить"
      >
        <Redo className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toolbar;