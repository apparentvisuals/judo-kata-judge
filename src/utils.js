export function getKataName(kata) {
  switch (kata) {
    case 'nnk3':
      return 'Nage-no-kata 3 Set';
    case 'nnk':
      return 'Nage-no-kata';
    case 'knk':
      return 'Katame-no-kata';
    case 'jnk':
      return 'Ju-no-kata';
    case 'kgj':
      return 'Kodokan-goshin-jutsu';
    case 'kink':
      return 'Kime-no-kata';
    case 'ko5':
      return 'Kodomo-no-kata 5';
    case 'ko6':
      return 'Kodomo-no-kata 6';
    case 'ko7':
      return 'Kodomo-no-kata 7';
    default:
      return '';
  }
};

export function handleServerError(err) {
  if (err.response) {
    return err.response._data.message;
  } else {
    return err.message;
  }
}
