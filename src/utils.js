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
    default:
      return '';
  }
};

export function handleServerError(err) {
  if (err.response) {
    console.log(err.response._data.message);
    return err.response._data.message;
  } else {
    return err.message;
  }
}
