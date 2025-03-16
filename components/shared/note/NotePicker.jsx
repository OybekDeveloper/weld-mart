"use client";

import React, { useState } from "react";
import Tiptap from "./Tiptap";

const Todo = ({ handleContentChange, content, name }) => {
  return (
    <div className="mt-3">
      <Tiptap
        content={content}
        onChange={(newContent) => handleContentChange(newContent, name)}
      />
    </div>
  );
};

export default Todo;
