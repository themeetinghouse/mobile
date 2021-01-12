import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import * as Linking from 'expo-linking';
import InstagramFeed from '../home/InstagramFeed';

const instaData = {
  data: {
    getInstagramByLocation: {
      items: [
        {
          id: 'CJGmwEvlVri',
          locationId: 'themeetinghouse',
          thumbnails: [
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/s150x150/132051851_741777823429247_843297535879666640_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=111&_nc_ohc=v6U7hx-q_L0AX-7AZQt&tp=1&oh=7e82ab10ea2ecf3c91e1c552cc6b906c&oe=600CCF56',
              config_width: 150,
              config_height: 150,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/s240x240/132051851_741777823429247_843297535879666640_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=111&_nc_ohc=v6U7hx-q_L0AX-7AZQt&tp=1&oh=ce799575810eaf3a69ae2852b8183664&oe=600CAC20',
              config_width: 240,
              config_height: 240,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/s320x320/132051851_741777823429247_843297535879666640_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=111&_nc_ohc=v6U7hx-q_L0AX-7AZQt&tp=1&oh=06da3fcbea192303937f803b1e9e8cdc&oe=600B0726',
              config_width: 320,
              config_height: 320,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/s480x480/132051851_741777823429247_843297535879666640_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=111&_nc_ohc=v6U7hx-q_L0AX-7AZQt&tp=1&oh=606dd89ffe709ee4a2b7227ab0190899&oe=600D4880',
              config_width: 480,
              config_height: 480,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/s640x640/132051851_741777823429247_843297535879666640_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=111&_nc_ohc=v6U7hx-q_L0AX-7AZQt&tp=1&oh=cb6ed1ea81bc138d807db49fd67602a9&oe=600DB173',
              config_width: 640,
              config_height: 640,
            },
          ],
          altText:
            "Photo by The Meeting House on December 22, 2020. Image may contain: text that says '\"You don't need to make Christmas great for everyone. You don't need to make up for what will certainly be missing because this year is a pandemic and therefore it'll be weirder and feel like less.\" Natalie Frisk'.",
          timestamp: 1608646924,
          createdAt: '2020-12-22T22:01:14.547Z',
          updatedAt: '2020-12-23T14:01:19.194Z',
        },
        {
          id: 'CJFLHM0lHp4',
          locationId: 'themeetinghouse',
          thumbnails: [
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/s150x150/131416756_861339737952168_3081219852457107335_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=100&_nc_ohc=qbisne7qvrgAX8y36aV&tp=1&oh=db4c419e98c9bacdb898c8edc08a5db1&oe=600BD5C6',
              config_width: 150,
              config_height: 150,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/s240x240/131416756_861339737952168_3081219852457107335_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=100&_nc_ohc=qbisne7qvrgAX8y36aV&tp=1&oh=c2649588c30f0fdb6b0835569b6d36b0&oe=600CBA44',
              config_width: 240,
              config_height: 240,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/s320x320/131416756_861339737952168_3081219852457107335_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=100&_nc_ohc=qbisne7qvrgAX8y36aV&tp=1&oh=89d30ec7b624c0c8cf91b255e8ee5e1a&oe=600D28BE',
              config_width: 320,
              config_height: 320,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/s480x480/131416756_861339737952168_3081219852457107335_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=100&_nc_ohc=qbisne7qvrgAX8y36aV&tp=1&oh=c1248d89dcba71de38ac3a7b18d0cfa3&oe=600D0BFB',
              config_width: 480,
              config_height: 480,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/s640x640/131416756_861339737952168_3081219852457107335_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=100&_nc_ohc=qbisne7qvrgAX8y36aV&tp=1&oh=77ccbe5589033d70ef2c25ec8e2be63e&oe=600AF9C1',
              config_width: 640,
              config_height: 640,
            },
          ],
          altText:
            'Photo by The Meeting House on December 21, 2020. Image may contain: 1 person, smiling, phone, hat, closeup and outdoor.',
          timestamp: 1608598907,
          createdAt: '2020-12-22T14:01:16.541Z',
          updatedAt: '2020-12-23T14:01:19.409Z',
        },
        {
          id: 'CJCxm6WF8NO',
          locationId: 'themeetinghouse',
          thumbnails: [
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/s150x150/132028103_2494627844173384_820928203962253482_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=104&_nc_ohc=X8DQDDQDIUoAX-1VEjO&tp=1&oh=c468326fd5c964b8ff1391fa69beaa44&oe=600AE500',
              config_width: 150,
              config_height: 150,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/s240x240/132028103_2494627844173384_820928203962253482_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=104&_nc_ohc=X8DQDDQDIUoAX-1VEjO&tp=1&oh=b5094fb1ca927097650c831fa7e5171a&oe=600DCEFA',
              config_width: 240,
              config_height: 240,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/s320x320/132028103_2494627844173384_820928203962253482_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=104&_nc_ohc=X8DQDDQDIUoAX-1VEjO&tp=1&oh=cf526e807de0a2ecbd8e4b6745cd4e21&oe=600B1C88',
              config_width: 320,
              config_height: 320,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/s480x480/132028103_2494627844173384_820928203962253482_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=104&_nc_ohc=X8DQDDQDIUoAX-1VEjO&tp=1&oh=82640b7e707b991693d5c73d5a1f72f4&oe=600EBBC1',
              config_width: 480,
              config_height: 480,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/s640x640/132028103_2494627844173384_820928203962253482_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=104&_nc_ohc=X8DQDDQDIUoAX-1VEjO&tp=1&oh=dbf247d6f7a474b6283c5843af8bf107&oe=600B4E7B',
              config_width: 640,
              config_height: 640,
            },
          ],
          altText:
            'Photo by The Meeting House on December 20, 2020. Image may contain: one or more people and people on stage.',
          timestamp: 1608518399,
          createdAt: '2020-12-21T22:01:17.265Z',
          updatedAt: '2020-12-23T14:01:19.734Z',
        },
        {
          id: 'CJBp_eCFlTJ',
          locationId: 'themeetinghouse',
          thumbnails: [
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/s150x150/131895199_1029350220919924_4241838485484560234_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=104&_nc_ohc=xnbLsYys2RkAX_GHR2x&tp=1&oh=3ea675063c9d426cdce6458cb3a1a434&oe=600DC836',
              config_width: 150,
              config_height: 150,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/s240x240/131895199_1029350220919924_4241838485484560234_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=104&_nc_ohc=xnbLsYys2RkAX_GHR2x&tp=1&oh=20962c3131f95e2ac72d2a2b6d49374c&oe=600DB3FE',
              config_width: 240,
              config_height: 240,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/s320x320/131895199_1029350220919924_4241838485484560234_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=104&_nc_ohc=xnbLsYys2RkAX_GHR2x&tp=1&oh=b18dc3f11b349f39ab2596e33e43bc10&oe=600C8D23',
              config_width: 320,
              config_height: 320,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/s480x480/131895199_1029350220919924_4241838485484560234_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=104&_nc_ohc=xnbLsYys2RkAX_GHR2x&tp=1&oh=0c99668b60d9a13fff01cfe4439d452a&oe=600B64E1',
              config_width: 480,
              config_height: 480,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/s640x640/131895199_1029350220919924_4241838485484560234_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=104&_nc_ohc=xnbLsYys2RkAX_GHR2x&tp=1&oh=3b95126acecbc6f436de3e2563d79f11&oe=600CE5C1',
              config_width: 640,
              config_height: 640,
            },
          ],
          altText:
            "Photo by The Meeting House on December 20, 2020. Image may contain: text that says '\"The nativity isn't just a symbol of how God came into the world back then. It's a template for how God comes into the world today: through selfless acts of love.\" Eric Versluis'.",
          timestamp: 1608480851,
          createdAt: '2020-12-21T22:01:17.551Z',
          updatedAt: '2020-12-23T14:01:20.130Z',
        },
        {
          id: 'CJAMla2FFSd',
          locationId: 'themeetinghouse',
          thumbnails: [
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/s150x150/132025914_1061277941006132_6324099070317855743_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=108&_nc_ohc=zQANsImjy-4AX-E6ETa&tp=1&oh=da76feb56e86de73d6828917908b791b&oe=600D3E5E',
              config_width: 150,
              config_height: 150,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/s240x240/132025914_1061277941006132_6324099070317855743_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=108&_nc_ohc=zQANsImjy-4AX-E6ETa&tp=1&oh=6b1e0dd8e60ec777da17e40c4ab567db&oe=600D8396',
              config_width: 240,
              config_height: 240,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/s320x320/132025914_1061277941006132_6324099070317855743_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=108&_nc_ohc=zQANsImjy-4AX-E6ETa&tp=1&oh=ed0b7e0ca3b0152c71ee71d57191bcb7&oe=600B454B',
              config_width: 320,
              config_height: 320,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/s480x480/132025914_1061277941006132_6324099070317855743_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=108&_nc_ohc=zQANsImjy-4AX-E6ETa&tp=1&oh=0c1350643a480ad8501ab5478b1785ee&oe=600E1289',
              config_width: 480,
              config_height: 480,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/s640x640/132025914_1061277941006132_6324099070317855743_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=108&_nc_ohc=zQANsImjy-4AX-E6ETa&tp=1&oh=b6bc730b5c8490ba75ed4b57cc02d29d&oe=600DE429',
              config_width: 640,
              config_height: 640,
            },
          ],
          altText:
            'Photo by The Meeting House on December 19, 2020. Image may contain: one or more people, people playing musical instruments, people on stage and indoor.',
          timestamp: 1608431879,
          createdAt: '2020-12-21T22:01:17.835Z',
          updatedAt: '2020-12-23T14:01:20.361Z',
        },
        {
          id: 'CI-2bkaM8wN',
          locationId: 'themeetinghouse',
          thumbnails: [
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/c0.135.1080.1080a/s150x150/131934628_1100138873742563_9053745708158282391_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=111&_nc_ohc=si2VIF-at38AX-2cF66&tp=1&oh=9cb578a0e3201e39c7fb0487a19409b8&oe=600C73B9',
              config_width: 150,
              config_height: 150,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/c0.135.1080.1080a/s240x240/131934628_1100138873742563_9053745708158282391_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=111&_nc_ohc=si2VIF-at38AX-2cF66&tp=1&oh=eb9c6495bec88bb4d274356ec87ca087&oe=600E8A71',
              config_width: 240,
              config_height: 240,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/c0.135.1080.1080a/s320x320/131934628_1100138873742563_9053745708158282391_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=111&_nc_ohc=si2VIF-at38AX-2cF66&tp=1&oh=bad7e66ab0875151af8ab59834128c9a&oe=600EA630',
              config_width: 320,
              config_height: 320,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/c0.135.1080.1080a/s480x480/131934628_1100138873742563_9053745708158282391_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=111&_nc_ohc=si2VIF-at38AX-2cF66&tp=1&oh=eda965a6e04084293e80ef7e2099c26c&oe=600DCEEE',
              config_width: 480,
              config_height: 480,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c0.135.1080.1080a/s640x640/131934628_1100138873742563_9053745708158282391_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=111&_nc_ohc=si2VIF-at38AX-2cF66&tp=1&oh=b54587a0f072e9d607581674a813be0e&oe=600BB5D8',
              config_width: 640,
              config_height: 640,
            },
          ],
          altText:
            "Photo by The Meeting House on December 19, 2020. Image may contain: text that says 'CHRISTMAS IN 3 ACTS AFRAID ACT 3 FAIRYTALE'.",
          timestamp: 1608386718,
          createdAt: '2020-12-21T22:01:18.108Z',
          updatedAt: '2020-12-23T14:01:20.592Z',
        },
        {
          id: 'CI9K1OEF8zv',
          locationId: 'themeetinghouse',
          thumbnails: [
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/c0.111.1439.1439a/s150x150/131634785_838690830248172_516786905457951151_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=100&_nc_ohc=lKXrWdrycMYAX8b5zie&tp=1&oh=f1fbd585fdc1361374dff1894fa51589&oe=600B7988',
              config_width: 150,
              config_height: 150,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/c0.111.1439.1439a/s240x240/131634785_838690830248172_516786905457951151_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=100&_nc_ohc=lKXrWdrycMYAX8b5zie&tp=1&oh=96053585b7ff5ba8e7df89cbffe4a1b0&oe=600DA44E',
              config_width: 240,
              config_height: 240,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/c0.111.1439.1439a/s320x320/131634785_838690830248172_516786905457951151_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=100&_nc_ohc=lKXrWdrycMYAX8b5zie&tp=1&oh=ef774d3ce224e07d69bf4034e654818b&oe=600DE5F8',
              config_width: 320,
              config_height: 320,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/c0.111.1439.1439a/s480x480/131634785_838690830248172_516786905457951151_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=100&_nc_ohc=lKXrWdrycMYAX8b5zie&tp=1&oh=fe03476861af589a3001ef24c7cfee7e&oe=600E732E',
              config_width: 480,
              config_height: 480,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c0.111.1439.1439a/s640x640/131634785_838690830248172_516786905457951151_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=100&_nc_ohc=lKXrWdrycMYAX8b5zie&tp=1&oh=a5b20ac61fda265272879e9e746ef6bc&oe=600BE8CD',
              config_width: 640,
              config_height: 640,
            },
          ],
          altText:
            'Photo by The Meeting House on December 18, 2020. Image may contain: 1 person, standing.',
          timestamp: 1608330297,
          createdAt: '2020-12-21T22:01:18.295Z',
          updatedAt: '2020-12-23T14:01:20.766Z',
        },
        {
          id: 'CI6aW6PlGEv',
          locationId: 'themeetinghouse',
          thumbnails: [
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/c0.96.768.768a/s150x150/131369823_1310063026053362_7161205273140893483_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=102&_nc_ohc=TgJKKyPp6dEAX9YZCjO&tp=1&oh=dc60268bfb8faf380edfe61f1bde3ace&oe=600E1791',
              config_width: 150,
              config_height: 150,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/c0.96.768.768a/s240x240/131369823_1310063026053362_7161205273140893483_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=102&_nc_ohc=TgJKKyPp6dEAX9YZCjO&tp=1&oh=59494799163ebd63a42e01ddf3e8635f&oe=600CFE59',
              config_width: 240,
              config_height: 240,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/c0.96.768.768a/s320x320/131369823_1310063026053362_7161205273140893483_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=102&_nc_ohc=TgJKKyPp6dEAX9YZCjO&tp=1&oh=36c336835a37d8ae4ff2c2bd81f5d568&oe=600E3E08',
              config_width: 320,
              config_height: 320,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/e35/c0.96.768.768a/s480x480/131369823_1310063026053362_7161205273140893483_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=102&_nc_ohc=TgJKKyPp6dEAX9YZCjO&tp=1&oh=abc2822b48269bc4c88cfc577c7f02bc&oe=600D38C6',
              config_width: 480,
              config_height: 480,
            },
            {
              src:
                'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c0.96.768.768a/s640x640/131369823_1310063026053362_7161205273140893483_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=102&_nc_ohc=TgJKKyPp6dEAX9YZCjO&tp=1&oh=2f244810322069c68a03ae5d39381bf3&oe=600DA23F',
              config_width: 640,
              config_height: 640,
            },
          ],
          altText:
            'Photo shared by The Meeting House on December 17, 2020 tagging @lrthoms. Image may contain: 2 people, people smiling, hat, closeup and indoor.',
          timestamp: 1608237774,
          createdAt: '2020-12-17T22:01:18.916Z',
          updatedAt: '2020-12-23T14:01:20.933Z',
        },
      ],
      nextToken:
        'eyJ2ZXJzaW9uIjoyLCJ0b2tlbiI6IkFRSUNBSGg5OUIvN3BjWU41eE96NDZJMW5GeGM4WUNGeG1acmFOMUpqajZLWkFDQ25BRW1Cd25VOVdES3NTZ1VsbEpTbUFabEFBQURTekNDQTBjR0NTcUdTSWIzRFFFSEJxQ0NBemd3Z2dNMEFnRUFNSUlETFFZSktvWklodmNOQVFjQk1CNEdDV0NHU0FGbEF3UUJMakFSQkF3VEtLdzNTVFBCc3Jza2lRSUNBUkNBZ2dMK3V1czFWT1lZY2YwSUQvVmE5cWlib2Z3eU5vYjJzUU1Kb3haektQVGh3Y0lLblFHSzVrUlNhL29iQTBsRFhodHZYU0tCQlZwc3VWVDl1SDRwVi9qdGlsckdkRFUyY0FSclA1NThsR2U5RktzK3JOWkoyKzRadzZyVjNaYTE2RGFkeGJiNVNhb1luZXgxN0NxTjRremFranJ5bVYwV2pKTzFOL3BLeVUyOERlMG1XTXMyVW1LUGJwcnNWc0NIVlNkN0NzUXZSSnltcG9SdDlUMk11dXhsY2Q2MEJXUlpzekozRm9ReERRMWpENnZIdU9WY0Zsc1pMQTRRZFA4YnNrekE2ak92LzA4Y1M0clFiSXJVRHhzK3pGYTY0SFFValRQb0h2dVdGUTNqSFYwdXlTVHEra1dKK2RCMlIwMlExY3ZIdkFoYytFeWxqbG5yaDFPeXluZlFXcDZCRHZSU2trTmNqVkpmdzNWY0RGdDNNNnpyMTY2K28xaEtaRDd4VGpqNk1RYU4wRWlncy9pSjNaeTFGclRmbXVJV21wUHhtQll3NTVnQWJFL1ZZVDRJbVJpZ0dnWkZ0cnpPay9nQk14TE8yWGllb01Jb0swdE9RZWZsNjFpeHk5QlZWOFBpa2V5RGxkaklNeThBYTdSZjZQaVFmckhwRmJSb01GN1hqR0tPZFFidWk5T1h1ZGZ0WFpHOHRqOGMrd0wzd1lmYUxVTDlsQjdmU3BCNmZKVlZ5ZzFJc3NwOVd1ME1EUlRrdlZhYVo3SjlRTjVWaVJiTXVOMDFjYXk1Nkg2NU9rWnMrNC92Unl5MkRJOGtmcU5NdWUxdkl2Z0MvaHVmKzJkakJyaFMxZXo2YW5MRGxmbjk2SzYxTFJBWEwvSGkvY3VHM2h5SE5KQy9CTW01Y01FbnRkd0NaSEIwWm5VbjhSUkpkZHh4S0ZXY1ZzT0dna1FMa1hMVytMTWR5YS90aEErUFkwSEJtbFVyL2UyVWJjZElkWHc4WUkwSm1uK2RxM25wTDhlS1dyTWcybnJxR3JKYTFuYzE5UnBuVnd5VEtxK1EzS3BrWjJXVDZ3a0VZa3FMWTl5NnM3T2R3VU1qeVJCYnRyS1ZhK21jVDdCUFFmbSsycWtXcHNxbGlJTk9pWW5oTllPc1RrZHpXK2FCUGRhWm4xbnZ1RGp1bzlaRjAxNlJXblgzZjlWUnRKSGdzWkdyVEtKRFJBbjREbFNkbXRremlZTzVtdFlkdFhzVUcrOUFvNjUwemY5N2Nzek02aU8xeUo2RmZ0MytOc1RxNVNTRzFyQWVLRmpPOEFWdTBSU2VhT2F1SzVocnVlMkNyNEZMMlNUYnpKMllROHZVa08xV1lBPT0ifQ==',
    },
  },
};

const dataLength = instaData.data.getInstagramByLocation.items.length;

describe('Instagram grid', () => {
  test('Each image should render, check snapshot', () => {
    const { toJSON, queryByLabelText } = render(
      <InstagramFeed images={instaData.data.getInstagramByLocation.items} />
    );

    instaData.data.getInstagramByLocation.items.forEach((image) => {
      expect(queryByLabelText(image.altText)).toBeTruthy();
    });

    expect(toJSON()).toMatchSnapshot();
  });

  test('Can press each image', () => {
    Linking.openURL = jest.fn();

    const { queryAllByRole } = render(
      <InstagramFeed images={instaData.data.getInstagramByLocation.items} />
    );

    expect(queryAllByRole('imagebutton').length).toEqual(dataLength);

    queryAllByRole('imagebutton').forEach((image) => {
      fireEvent.press(image);
    });

    expect(Linking.openURL).toHaveBeenCalledTimes(dataLength);
  });

  test('Image does not render on error', () => {
    const { queryByLabelText, queryAllByRole } = render(
      <InstagramFeed images={instaData.data.getInstagramByLocation.items} />
    );

    // all images render
    expect(queryAllByRole('imagebutton').length).toEqual(dataLength);

    // trigger error
    act(() => {
      queryByLabelText(
        instaData.data.getInstagramByLocation.items[0].altText
      ).props.onError();
    });

    // n-1 images render
    expect(queryAllByRole('imagebutton').length).toEqual(dataLength - 1);

    // trigger second error

    act(() => {
      queryByLabelText(
        instaData.data.getInstagramByLocation.items[1].altText
      ).props.onError();
    });

    // n-2 images render
    expect(queryAllByRole('imagebutton').length).toEqual(dataLength - 2);
  });
});
