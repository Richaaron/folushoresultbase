import React from "react";
import { X } from "lucide-react";

const MobileModal = ({
  isOpen,
  onClose,
  title,
  children,
  actions = [],
  maxWidth = "max-w-lg",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className={`bg-slate-900 w-full md:${maxWidth} rounded-t-3xl md:rounded-3xl border-4 border-black shadow-cartoon max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b-4 border-black p-4 md:p-6 flex items-center justify-between">
          <h2 className="text-lg md:text-2xl font-black text-white uppercase">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 text-white">{children}</div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="sticky bottom-0 bg-slate-900 border-t-4 border-black p-4 md:p-6 flex gap-3 flex-col-reverse md:flex-row">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                className={`flex-1 px-4 py-3 rounded-2xl border-4 border-black font-black uppercase text-sm transition-all ${action.className || "bg-accent-gold text-black hover:-translate-y-1"}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileModal;
