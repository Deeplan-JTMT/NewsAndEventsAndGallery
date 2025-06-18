import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI } from "@pnp/sp";

export interface INewsEventsGalleryProps {
  description: string;
  TitleNews: string;
  NewsListId: string;
  GalleryId: string;
  TitleGallery: string;
  sp: SPFI;
  context: WebPartContext;
  NewsToShow: number;
}
