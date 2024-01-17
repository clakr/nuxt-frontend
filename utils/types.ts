export type User = {
	id: number;
	name: string;
	email: string;
	email_verified_at: Date | null;
	created_at: Date;
	updated_at: Date;
};

export type LoginCredentials = Pick<User, "name" | "email">;

export type RegisterCredentials = LoginCredentials & {
	password: string;
	password_confirmation: string;
};

export type CreateUserParameters = LoginCredentials;
