import React from 'react';
import * as LucideIcons from 'lucide-react';

type IconProps = {
    name: keyof typeof LucideIcons;
    size?: number;
    className?: string;
};

export const Icon: React.FC<IconProps> = ({ name, size = 24, className = '' }) => {
    const LucideIcon = LucideIcons[name];
    return React.createElement(LucideIcon as any, { size, className });
};