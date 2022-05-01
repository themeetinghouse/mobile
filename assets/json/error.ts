export default {
  screen: {
    title: 'Error',
    config: {
      hideHeader: true,
      hideBottomNav: true,
      backgroundColor: 'white',
      fontColor: 'black',
      hideBackButton: true,
    },
    content: [
      {
        type: 'spacing',
        size: 32,
      },
      { type: 'logo', style: 'black' },
      {
        type: 'spacing',
        size: 128,
      },
      { type: 'header', style: 'header1', text: 'Page not found' },
      {
        type: 'spacing',
        size: 8,
      },
      {
        type: 'body',
        style: 'medium',
        text: 'We were unable to to find your page',
        bold: true,
      },
      {
        type: 'spacing',
        size: 8,
      },
      {
        type: 'body',
        style: 'medium',
        text: 'Our vision is to introduce spiritually curious people to the Jesus-centred life, through a movement of Jesus-centred churches.',
      },
      {
        type: 'spacing',
        size: 128,
      },
      {
        type: 'button',
        style: 'white',
        label: 'Go back',
        navigateTo: 'featured',
      },
    ],
  },
};
