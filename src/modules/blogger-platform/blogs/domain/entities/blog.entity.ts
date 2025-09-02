export class Blog {
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: string;

  constructor(name: string, description: string, websiteUrl: string) {
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
    this.isMembership = false;
    this.createdAt = new Date().toISOString();
  }
}
