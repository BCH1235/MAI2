export const BEAT_GENRE_KEY = 'beat';
export const BEAT_GENRE_LABEL = '비트';
export const SCORE_GENRE_LABEL = '(악보 변환)';

const resolveType = (itemOrType) =>
  typeof itemOrType === 'string'
    ? itemOrType
    : itemOrType?.collectionType || itemOrType?.type;

export const isBeatCollection = (itemOrType) => {
  const type = resolveType(itemOrType);
  if (!type || typeof type !== 'string') return false;
  return type.toLowerCase() === BEAT_GENRE_KEY;
};

export const isScoreCollection = (itemOrType) => {
  const type = resolveType(itemOrType);
  if (!type || typeof type !== 'string') return false;
  return type.toLowerCase().startsWith('score');
};

export const getBeatGenreLabels = () => [BEAT_GENRE_LABEL];

export const getBeatGenreLabel = () => BEAT_GENRE_LABEL;

export const getScoreGenreLabels = () => [SCORE_GENRE_LABEL];

export const getScoreGenreLabel = () => SCORE_GENRE_LABEL;
