export type BiologicalSexValue = 'M' | 'F';

export const BIOLOGICAL_SEX_OPTIONS = [
    { label: 'Masculino', value: 'M' },
    { label: 'Feminino', value: 'F' },
] as const;

const BIOLOGICAL_SEX_ALIASES: Record<string, BiologicalSexValue> = {
    masculino: 'M',
    male: 'M',
    m: 'M',
    feminino: 'F',
    female: 'F',
    f: 'F',
};

export const normalizeBiologicalSex = (value: unknown): BiologicalSexValue | '' => {
    if (typeof value !== 'string') {
        return '';
    }

    const normalizedValue = value.trim().toLowerCase();

    return BIOLOGICAL_SEX_ALIASES[normalizedValue] ?? '';
};

export const getBiologicalSexFromUser = (user: Record<string, unknown> | null | undefined): BiologicalSexValue | '' => {
    if (!user) {
        return '';
    }

    return normalizeBiologicalSex(
        user.biological_sex ??
        user.biologicalSex ??
        user.sexo_biologico ??
        user.sexoBiologico ??
        user.sex ??
        user.gender,
    );
};