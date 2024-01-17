export type User = {
	id: number;
	name: string;
	email: string;
	email_verified_at: Date | null;
	created_at: Date;
	updated_at: Date;
};

export type RegisterCredentials = {
	name: string;
	email: string;
	password: string;
	password_confirmation: string;
};

export type LoginCredentials = Pick<RegisterCredentials, "email" | "password">;
