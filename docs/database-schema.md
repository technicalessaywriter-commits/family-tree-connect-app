# Database Schema

MongoDB is used through Mongoose models.

## User

```ts
{
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## FamilyTree

```ts
{
  name: string;
  description?: string;
  owner: ObjectId<User>;
  collaborators: {
    user: ObjectId<User>;
    role: "admin" | "editor" | "viewer";
  }[];
  invites: {
    email: string;
    role: "admin" | "editor" | "viewer";
    token: string;
    acceptedAt?: Date;
    expiresAt?: Date;
  }[];
  events: {
    title: string;
    date: Date;
    description?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Member

```ts
{
  tree: ObjectId<FamilyTree>;
  fullName: string;
  gender: "female" | "male" | "nonbinary" | "unknown";
  birthDate: Date;
  deathDate?: Date;
  biography?: string;
  photoUrl?: string;
  generation: number;
  position: { x: number; y: number };
  relationships: {
    type: "parent" | "child" | "sibling" | "spouse" | "grandparent";
    member: ObjectId<Member>;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
```

Indexes:

- `Member.tree`
- `Member.fullName` and `Member.biography` text search
- `User.email` unique
