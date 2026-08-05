import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";

const mdComponents: Components = {

    h1: ({ children }) => (
        <h1 className="text-3xl font-bold tracking-tight mb-6 mt-10 first:mt-0 text-light">
            {children}
        </h1>
    ),

    h2: ({ children }) => {
        let rawText = "";

        if (Array.isArray(children)) {
            rawText = children.map((c) => (typeof c === "string" ? c : "")).join("");
        } else if (typeof children === "string") {
            rawText = children;
        }

        const id = rawText
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, "")
            .replace(/\s+/g, "-");

        return (
            <h2
                id={id}
                className="text-xl font-semibold tracking-tight mt-10 mb-4 text-light scroll-mt-28"
            >
                {children}
            </h2>
        );
    },

    h3: ({ children }) => (
        <h3 className="text-base font-semibold mt-7 mb-3 text-light">{children}</h3>
    ),

    p: ({ children }) => (
        <p className="text-sm text-helper leading-relaxed mb-4">{children}</p>
    ),

    ul: ({ children }) => (
        <ul className="list-disc list-inside text-sm text-helper leading-relaxed mb-4 space-y-1 pl-2">
            {children}
        </ul>
    ),

    ol: ({ children }) => (
        <ol className="list-decimal list-inside text-sm text-helper leading-relaxed mb-4 space-y-1 pl-2">
            {children}
        </ol>
    ),

    li: ({ children }) => <li className="leading-relaxed">{children}</li>,

    a: ({ href, children }) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
            {children}
        </a>
    ),

    strong: ({ children }) => (
        <strong className="font-semibold text-light">{children}</strong>
    ),

    em: ({ children }) => <em className="italic text-label">{children}</em>,

    blockquote: ({ children }) => (
        <blockquote className="border-l-2 border-primary pl-4 my-4 text-sm text-label italic">
            {children}
        </blockquote>
    ),

    hr: () => <hr className="border-light-10 my-8" />,

    table: ({ children }) => (
        <div className="overflow-x-auto my-6 rounded-xl border border-light-10">
            <table className="w-full text-sm">{children}</table>
        </div>
    ),
    thead: ({ children }) => <thead className="bg-surface">{children}</thead>,
    th: ({ children }) => (
        <th className="px-4 py-3 text-left font-semibold text-light border-b border-light-10">
            {children}
        </th>
    ),
    td: ({ children }) => (
        <td className="px-4 py-3 text-helper border-b border-light-10 last-of-type:border-b-0">
            {children}
        </td>
    ),

    code: ({ className, children, ...props }) => {
        const isInline = !className;

        return isInline ? (
            <code className="bg-surface text-primary px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                {children}
            </code>
        ) : (
            <code
                className={`${className} block bg-surface rounded-xl p-4 text-xs font-mono overflow-x-auto`}
                {...props}
            >
                {children}
            </code>
        );
    },
    pre: ({ children }) => (
        <pre className="my-4 overflow-x-auto rounded-xl bg-surface border border-light-10">{children}</pre>
    ),
};

interface LegalMarkdownProps {
    content: string;
}

export const LegalMarkdown = ({ content }: LegalMarkdownProps) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize, rehypeHighlight]}
            components={mdComponents}
        >
            {content}
        </ReactMarkdown>
    );
}; 
