import { motion } from 'framer-motion';

interface SectionPaginationProps {
    sections: string[];
    activeSection: string;
    showActiveLabel: boolean;
    onSectionClick: (id: string) => void;
}

export default function SectionPagination({ 
    sections, 
    activeSection, 
    showActiveLabel, 
    onSectionClick 
}: SectionPaginationProps) {
    return (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-[150] hidden md:flex flex-col gap-6">
            {sections.map((id) => (
                <button
                    key={id}
                    onClick={() => onSectionClick(id)}
                    className="group flex items-center justify-end gap-4"
                >
                    <span className={`text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-500 ${
                        activeSection === id
                            ? (showActiveLabel ? 'opacity-100 translate-x-0 text-gold' : 'opacity-0 translate-x-4 text-gold group-hover:opacity-100 group-hover:translate-x-0')
                            : 'opacity-0 translate-x-4 text-white group-hover:opacity-50 group-hover:translate-x-0'
                    }`}>
                        {id}
                    </span>
                    <div className="relative flex items-center justify-center w-6 h-6">
                        <div className={`absolute inset-0 m-auto w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                            activeSection === id ? 'bg-gold scale-[1.5]' : 'bg-white/30 group-hover:bg-white/60'
                        }`}></div>
                        {activeSection === id && (
                            <motion.div
                                layoutId="active-dot"
                                className="absolute inset-0 m-auto w-5 h-5 border border-gold rounded-full"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            />
                        )}
                    </div>
                </button>
            ))}
        </div>
    );
}
