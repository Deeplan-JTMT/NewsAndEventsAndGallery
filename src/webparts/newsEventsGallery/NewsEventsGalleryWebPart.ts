import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart, WebPartContext } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'NewsEventsGalleryWebPartStrings';
import NewsEventsGallery from './components/NewsEventsGallery';
import { INewsEventsGalleryProps } from './components/INewsEventsGalleryProps';
import getSP from '../PnPjsConfig';
import { SPFI } from "@pnp/sp";
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy, PropertyFieldNumber } from '@pnp/spfx-property-controls';

const { solution } = require("../../../config/package-solution.json");

export interface INewsEventsGalleryWebPartProps {
  description: string;
  TitleNews: string;
  NewsListId: string;
  GalleryId: string;
  TitleGallery: string;
  context: WebPartContext;
  NewsToShow: number;
}

export default class NewsEventsGalleryWebPart extends BaseClientSideWebPart<INewsEventsGalleryWebPartProps> {

  sp: SPFI

  public render(): void {
    const element: React.ReactElement<INewsEventsGalleryProps> = React.createElement(
      NewsEventsGallery,
      {
        description: this.properties.description,
        TitleNews: this.properties.TitleNews,
        NewsListId: this.properties.NewsListId,
        GalleryId: this.properties.GalleryId,
        TitleGallery: this.properties.TitleGallery,
        sp: this.sp,
        context: this.context,
        NewsToShow: this.properties.NewsToShow,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    this.sp = getSP(this.context)
    return this._getEnvironmentMessage().then(message => {

    });
  }



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse(solution.version);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('TitleNews', {
                  label: "TitleNews"
                }),
                PropertyFieldListPicker("NewsListId", {
                  label: "Select News list",
                  selectedList: this.properties.NewsListId,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context as any,
                  deferredValidationTime: 0,
                  key: "listPickerFieldId",
                }),
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyFieldListPicker("GalleryId", {
                  label: "Select Gallery list",
                  selectedList: this.properties.GalleryId,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context as any,
                  deferredValidationTime: 0,
                  key: "GalleryId",
                }),
                PropertyPaneTextField('TitleGallery', {
                  label: "TitleGallery"
                }),
                PropertyFieldNumber("NewsToShow", {
                  key: "NewsToShow",
                  label: "News To Show",
                  description: "News To Show",
                  value: this.properties.NewsToShow,
                  disabled: false
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
