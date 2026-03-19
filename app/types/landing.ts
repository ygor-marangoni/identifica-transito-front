export interface LandingMenuItem {
    href: string;
    label: string;
    icon: string;
}

export interface LandingImpactStat {
    icon: string;
    value: string;
    counterTarget: number;
    counterFormat: string;
    description: string;
}

export interface LandingProjectPillar {
    icon: string;
    title: string;
    description: string;
    tone: string;
}

export interface LandingFeaturedTag {
    title: string;
    description: string;
    image: string;
    imageCover: string;
    tone: string;
}

export interface LandingStep {
    number: string;
    icon: string;
    title: string;
    description: string;
}

export interface LandingFaqItem {
    question: string;
    answer: string;
}