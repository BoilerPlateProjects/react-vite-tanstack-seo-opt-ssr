export class TagBuilder {
  private _attrs: Record<string, any> = {};
  private contents: (string | undefined)[] = [];

  constructor(private readonly tag: string) {}

  addAttribute(name: string, value: any) {
    this._attrs[name] = value;
    return this;
  }

  addAttributes(attrs: Record<string, any>) {
    this._attrs = { ...this._attrs, ...attrs };
    return this;
  }

  addContent(...contents: (string | undefined)[]) {
    this.contents.push(...contents);
    return this;
  }

  clone() {
    const newTagBuilder = new TagBuilder(this.tag);
    Object.assign(newTagBuilder, this);
    return newTagBuilder;
  }

  toString() {
    const attrs = Object.entries(this._attrs)
      .map(([name, value]) => `${name}="${value}"`)
      .join(" ");

    return `<${this.tag}${attrs ? ` ${attrs}` : ""}>${this.contents.filter(Boolean).join("\n") || ""}</script>`;
  }
}
