/* eslint-disable prettier/prettier */
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface MarkdownProps {
    content: string
    className?: string
}

export const Markdown = ({ content, className = '' }: MarkdownProps) => {
    return (
        <ReactMarkdown
            className={className}
            remarkPlugins={[remarkGfm]}
            components={{
                table: ({ node, ...props }) => (
                    <table
                        className="border-collapse border border-gray-300 my-4"
                        {...props}
                    />
                ),
                th: ({ node, ...props }) => (
                    <th
                        className="border border-gray-300 px-4 py-2 bg-gray-100"
                        {...props}
                    />
                ),
                td: ({ node, ...props }) => (
                    <td className="border border-gray-300 px-4 py-2" {...props} />
                ),
                h1: ({ node, ...props }) => (
                    <h1 className="text-2xl font-bold my-4" {...props} />
                ),
                h2: ({ node, ...props }) => (
                    <h2 className="text-xl font-bold my-3" {...props} />
                ),
                h3: ({ node, ...props }) => (
                    <h3 className="text-lg font-bold my-2" {...props} />
                ),
                p: ({ node, ...props }) => (
                    <p className="my-4 whitespace-pre-line" {...props} />
                ),
                strong: ({ node, ...props }) => (
                    <strong className="font-bold" {...props} />
                ),
                em: ({ node, ...props }) => <em className="italic" {...props} />,
                del: ({ node, ...props }) => (
                    <del className="line-through" {...props} />
                ),
                ul: ({ node, ...props }) => (
                    <ul className="list-none list-inside my-4 space-y-2" {...props} />
                ),
                ol: ({ node, ...props }) => (
                    <ol className="list-none list-inside my-4 space-y-2" {...props} />
                ),
                li: ({ node, ...props }: { node?: any; children?: React.ReactNode }) => {
                    const isNested = node?.parent?.parent?.type === 'listItem' ||
                        node?.parent?.parent?.parent?.type === 'listItem';
                    return (
                        <li className="ml-4 mb-1 flex">
                            <span className="mr-2">{isNested ? '+' : '-'}</span>
                            <span className="pl-4">{props.children}</span>
                        </li>
                    );
                },
                blockquote: ({ node, ...props }) => (
                    <blockquote
                        className="border-l-4 border-gray-300 pl-4 my-2 italic"
                        {...props}
                    />
                ),
                hr: ({ node, ...props }) => (
                    <hr className="my-4 border-t border-gray-300" {...props} />
                ),
                a: ({ node, ...props }) => (
                    <a
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                    />
                ),
                img: ({ node, ...props }) => (
                    <img className="max-w-full h-auto my-2 rounded" {...props} />
                ),
                code({ inline, className, children, ...props }: {
                    inline?: boolean;
                    className?: string;
                    children?: React.ReactNode;
                }) {
                    const match = /language-(\w+)/.exec(className || '')

                    return !inline ? (
                        <div className="relative">
                            <SyntaxHighlighter
                                style={oneDark as any}
                                language={match?.[1] || ''}
                                PreTag="div"
                                className="rounded-lg !my-4"
                                showLineNumbers={true}
                                customStyle={{
                                    margin: 0,
                                    padding: '1rem',
                                    backgroundColor: '#282c34',
                                }}
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        </div>
                    ) : (
                        <code className="bg-gray-100 rounded px-1 py-0.5" {...props}>
                            {children}
                        </code>
                    )
                },
            }}
        >
            {content.replace(/\[([a-zA-Z]*?)\]/g, '')}
        </ReactMarkdown>
    )
}
