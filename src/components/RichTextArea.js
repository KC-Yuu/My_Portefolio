import React, { useRef, useState } from "react";

function RichTextArea({
    value,
    onChange,
    onFocus,
    onBlur,
    isFocused,
    required,
}) {
    const textareaRef = useRef(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleFormatText = (formatType) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        let formattedText = "";
        let newStart, newEnd;

        const markers = {
            bold: "**",
            italic: "*",
            underline: "__",
            list: "• ",
        };

        if (formatType === "list") {
            if (selectedText) {
                formattedText = selectedText
                    .split("\n")
                    .map((line) =>
                        line.startsWith("• ") ? line.substring(2) : `• ${line}`
                    )
                    .join("\n");

                const newMessage =
                    value.substring(0, start) +
                    formattedText +
                    value.substring(end);
                onChange({
                    target: {
                        name: "message",
                        value: newMessage,
                    },
                });

                setTimeout(() => {
                    textarea.focus();
                    textarea.setSelectionRange(
                        start + formattedText.length,
                        start + formattedText.length
                    );
                }, 0);
                return;
            } else {
                formattedText = "• ";
                const newMessage =
                    value.substring(0, start) +
                    formattedText +
                    value.substring(end);
                onChange({
                    target: {
                        name: "message",
                        value: newMessage,
                    },
                });

                setTimeout(() => {
                    textarea.focus();
                    textarea.setSelectionRange(start + 2, start + 2);
                }, 0);
                return;
            }
        }

        const marker = markers[formatType];
        const markerLength = marker.length;

        const beforeSelection = value.substring(
            Math.max(0, start - markerLength),
            start
        );
        const afterSelection = value.substring(
            end,
            Math.min(value.length, end + markerLength)
        );

        const isAlreadyFormatted =
            beforeSelection === marker && afterSelection === marker;

        if (isAlreadyFormatted) {
            const newMessage =
                value.substring(0, start - markerLength) +
                selectedText +
                value.substring(end + markerLength);

            onChange({
                target: {
                    name: "message",
                    value: newMessage,
                },
            });

            newStart = start - markerLength;
            newEnd = end - markerLength;
        } else {
            formattedText = `${marker}${selectedText}${marker}`;
            const newMessage =
                value.substring(0, start) +
                formattedText +
                value.substring(end);

            onChange({
                target: {
                    name: "message",
                    value: newMessage,
                },
            });

            newStart = start + markerLength;
            newEnd = end + markerLength;
        }

        setTimeout(() => {
            textarea.focus();
            if (selectedText) {
                textarea.setSelectionRange(newStart, newEnd);
            } else {
                const cursorPos = isAlreadyFormatted
                    ? start - markerLength
                    : start + markerLength;
                textarea.setSelectionRange(cursorPos, cursorPos);
            }
        }, 0);
    };

    const renderFormattedText = (text) => {
        if (!text) return "";

        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") 
            .replace(/\*(.*?)\*/g, "<em>$1</em>") 
            .replace(/__(.*?)__/g, "<u>$1</u>") 
            .replace(/<li>(.*?)<\/li>/g, "<ul><li>$1</li></ul>") 
            .replace(/<\/ul>\s*<ul>/g, "")
            .replace(/\n/g, "<br />"); 

        return formatted;
    };

    const togglePreview = () => {
        setShowPreview(!showPreview);
    };

    return (
        <>
            <div className="flex flex-wrap gap-1 mb-2 bg-gray-100 p-1 rounded-t border-2 border-b-0 border-gray-300">
                <button
                    type="button"
                    onClick={() => handleFormatText("bold")}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Gras"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={() => handleFormatText("italic")}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Italique"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={() => handleFormatText("underline")}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Souligné"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z" />
                    </svg>
                </button>
            </div>
            <div className="relative">
                <textarea
                    id="message"
                    name="message"
                    ref={textareaRef}
                    value={value}
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    className={`shadow appearance-none border-2 rounded-b w-full py-2 px-3 max-sm:py-1 max-sm:px-2 text-gray-700
                    leading-tight focus:outline-none focus:shadow-outline h-[150px] resize-none transition-all duration-300 ${
                        isFocused
                            ? "border-custom-gold bg-gray-100"
                            : "border-gray-300"
                    }`}
                    required={required}
                />
                <div
                    className={`absolute -bottom-1 left-0 right-0 h-1 bg-custom-gold rounded-b-md transform transition-all duration-300 ${
                        isFocused ? "scale-x-100" : "scale-x-0"
                    }`}
                ></div>
            </div>

            {value && (
                <div className="mt-5 flex justify-center">
                    <button
                        type="button"
                        onClick={togglePreview}
                        className="bg-custom-brown hover:bg-custom-gold text-white text-sm font-bold py-2 px-3 rounded transition-all duration-300"
                    >
                        Voir l'aperçu du mail
                    </button>
                </div>
            )}

            {showPreview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Aperçu du mail :
                            </h3>
                            <button
                                onClick={togglePreview}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-grow">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: renderFormattedText(value),
                                }}
                                className="preview-content text-gray-700"
                            />
                        </div>
                        <div className="border-t p-4 flex justify-end">
                            <button
                                onClick={togglePreview}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-all duration-300"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default RichTextArea;
