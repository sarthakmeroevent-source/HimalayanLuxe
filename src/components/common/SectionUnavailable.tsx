interface SectionUnavailableProps {
    message?: string;
}

export default function SectionUnavailable({ message = 'Content temporarily unavailable' }: SectionUnavailableProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 md:py-24 px-6">
            <div className="h-px w-12 bg-gold/20 mb-6" />
            <p className="text-white/30 text-sm tracking-[0.1em] uppercase font-medium text-center">
                {message}
            </p>
            <div className="h-px w-12 bg-gold/20 mt-6" />
        </div>
    );
}
