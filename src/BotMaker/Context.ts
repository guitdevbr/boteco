/* eslint-disable no-unused-vars */
import { AxiosRequestConfig } from 'axios';
import { Request } from 'express';
import { Update, Channel, SendMessageOptions } from '@src/Context';
import MountBotMakerRequest from './MountRequest';
import api from './api';

class BotMakerContext implements Channel {
  public update: Update;

  constructor(private readonly TOKEN: string, private readonly req: Request) {
    this.update = MountBotMakerRequest(this.req);
  }

  sendMessage = async (text: string, options: SendMessageOptions) => {
    return BotMakerContext.sendMessage(text, this.TOKEN, options);
  };

  sendImage = async (photoUrl: string, options: SendMessageOptions) => {
    return BotMakerContext.sendImage(photoUrl, this.TOKEN, options);
  };

  static sendMessage = async (text: string, TOKEN: string, options: SendMessageOptions) => {
    const config: AxiosRequestConfig = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'access-token': TOKEN,
      },
    };

    const data = {
      chatPlatform: options.chatPlatform,
      chatChannelNumber: options.chatChannelNumber,
      platformContactId: options.platformContactId,
      messageText: text,
    };

    return api.instance.post('/api/v1.0/message/v3', data, config);
  };

  static sendImage = async (photoUrl: string, TOKEN: string, options: SendMessageOptions) => {
    const config: AxiosRequestConfig = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'access-token': TOKEN,
      },
    };

    const data = {
      chatPlatform: options.chatPlatform,
      chatChannelNumber: options.chatChannelNumber,
      platformContactId: options.platformContactId,
      imageURL: photoUrl,
    };

    return api.instance.post('/api/v1.0/message/v3', data, config);
  };
}

export default BotMakerContext;
