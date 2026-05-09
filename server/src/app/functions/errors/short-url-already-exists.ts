export class ShortUrlAlreadyExists extends Error {
  constructor() {
    super('O link encurtado informado já existe.')
  }
}
