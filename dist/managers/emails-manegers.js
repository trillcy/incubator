"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
exports.authService = {
/*
async sendRegistraitonEmail(email: string): Promise<ViewUserType | null> {
  console.log('13====auth.serv')
  // сохраняем пользователя в БД
  return true
},

async checkCredential(
  loginOrEmail: string,
  password: string
): Promise<UserDBType | null> {
  const user: UserDBType | null =
    await usersRepository.findUserByLoginOrEmail(loginOrEmail)

  if (!user) return null
  const passwordHash = await bcrypt.hash(password, user.passwordSalt)
  if (user.passwordHash !== passwordHash) return null

  return user
},

async createUser(
  login: string,
  email: string,
  password: string
): Promise<ViewUserType | null> {
  const passwordSalt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, passwordSalt)

  const date = new Date()
  const newElement: UserAccountDBType = {
    _id: new ObjectId(),
    accountData: {
      userName: { login, email },
      passwordHash,
      createdAt: date,
    },
    emailConfirmation: {
      confirmationCode: uuidv4(),
      expirationDate: add(date, { hours: 1, minutes: 3 }),
      isConfirmed: false,
    },
  }

  const result = await usersRepository.saveAccountUser(newElement)

  return result
},
*/
};
