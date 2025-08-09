"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOMAIN_NAMES = exports.DOMAIN_COLORS = exports.StrengthDomain = void 0;
// CliftonStrengths domain categories with their associated colors
var StrengthDomain;
(function (StrengthDomain) {
    StrengthDomain["EXECUTING"] = "executing";
    StrengthDomain["INFLUENCING"] = "influencing";
    StrengthDomain["RELATIONSHIP_BUILDING"] = "relationship-building";
    StrengthDomain["STRATEGIC_THINKING"] = "strategic-thinking";
})(StrengthDomain || (exports.StrengthDomain = StrengthDomain = {}));
// Domain color mapping for Tailwind classes
exports.DOMAIN_COLORS = {
    [StrengthDomain.EXECUTING]: {
        primary: 'text-purple-600',
        secondary: 'text-purple-500',
        background: 'bg-purple-50',
        border: 'border-purple-200',
        hover: 'hover:bg-purple-100',
        gradient: 'from-purple-500 to-purple-600'
    },
    [StrengthDomain.INFLUENCING]: {
        primary: 'text-orange-600',
        secondary: 'text-orange-500',
        background: 'bg-orange-50',
        border: 'border-orange-200',
        hover: 'hover:bg-orange-100',
        gradient: 'from-orange-500 to-orange-600'
    },
    [StrengthDomain.RELATIONSHIP_BUILDING]: {
        primary: 'text-blue-600',
        secondary: 'text-blue-500',
        background: 'bg-blue-50',
        border: 'border-blue-200',
        hover: 'hover:bg-blue-100',
        gradient: 'from-blue-500 to-blue-600'
    },
    [StrengthDomain.STRATEGIC_THINKING]: {
        primary: 'text-green-600',
        secondary: 'text-green-500',
        background: 'bg-green-50',
        border: 'border-green-200',
        hover: 'hover:bg-green-100',
        gradient: 'from-green-500 to-green-600'
    }
};
// Domain display names
exports.DOMAIN_NAMES = {
    [StrengthDomain.EXECUTING]: 'Executing',
    [StrengthDomain.INFLUENCING]: 'Influencing',
    [StrengthDomain.RELATIONSHIP_BUILDING]: 'Relationship Building',
    [StrengthDomain.STRATEGIC_THINKING]: 'Strategic Thinking'
};
