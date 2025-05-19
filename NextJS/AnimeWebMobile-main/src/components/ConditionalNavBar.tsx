// components/ConditionalNavBar.tsx
'use client'
import React from "react";
import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

const ConditionalNavBar: React.FC = () => {
    const pathname = usePathname();

    // Danh sách các đường dẫn bị loại trừ
    const excludedPaths = ["/anime", "/chat/edit", "/chat/show", "/chat/edit/view", "/live2d/show", "/live2d/show/edit", "/live2d/show/edit/view"];

    if (excludedPaths.includes(pathname)) {
        return null;
    }

    return <NavBar />;
};

export default ConditionalNavBar;
