export type User = {
	id: number;
	name: string;
	email: string;
	emailVerifiedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
};

export type LoginCredentials = Pick<User, "name" | "email">;

export type RegisterCredentials = LoginCredentials & {
	password: string;
	password_confirmation: string;
};

export type CreateUserParameters = LoginCredentials;
