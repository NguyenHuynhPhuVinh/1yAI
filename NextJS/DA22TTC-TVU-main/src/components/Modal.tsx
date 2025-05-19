'use client'
import { createPortal } from 'react-dom';

interface ModalProps {
    children: React.ReactNode;
}

export default function Modal({ children }: ModalProps) {
    return createPortal(children, document.body);
} 