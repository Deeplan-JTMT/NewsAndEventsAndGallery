import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI } from "@pnp/sp"

export interface ICardNewsAndEventsProps {
  sp: SPFI;
  NewsListId: string;
  context: WebPartContext;
  TitleNews: string;
  NewsToShow: number;
}

export interface Likes {
  [key: string]: Like[];
}

export interface Like {
  "odata.type": string
  "odata.id": string
  "odata.etag": string
  "odata.editLink": string
  Id: number
  UserLikedEmail: string
  UserLikedDisplayName: string
  NewId: number
  ID: number
}


export interface New {
  "odata.type": string
  "odata.id": string
  "odata.etag": string
  "odata.editLink": string
  "Author@odata.navigationLinkUrl": string
  ID: number;
  Author: Author
  Picture: string;
  NewsContent: string
  SortByAppearanceOrder: string
  Created: string
  SiteLink: Picture
  Link: Link;
  Title: string;
}

export interface Author {
  "odata.type": string
  "odata.id": string
  Id: number
  Title: string
  Name: string
  EMail: string
}

export interface Picture {
  Description: string
  Url: string
}
export interface Link {
  Description: string
  Url: string
}