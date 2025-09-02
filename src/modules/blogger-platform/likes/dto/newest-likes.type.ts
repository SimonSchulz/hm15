export class NewestLike {
  addedAt: string = '';
  userId: string = '';
  login: string = '';

  static defaultValues() {
    return new NewestLike();
  }
  static setValue(userId: string, login: string, addedAt: string) {
    const dto = new NewestLike();
    dto.userId = userId;
    dto.login = login;
    dto.addedAt = addedAt;
    return dto;
  }
}
