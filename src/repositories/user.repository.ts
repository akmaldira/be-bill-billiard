import { User } from "@database/entities/user.entity";
import { Repository } from "typeorm";

class UserRepository extends Repository<User> {
  public async getByEmail(email: string): Promise<User | null> {
    return await this.findOne({
      select: ["id", "email", "name", "password", "role"],
      where: { email },
    });
  }
}

export default UserRepository;
