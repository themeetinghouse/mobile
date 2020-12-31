import React from 'react';
import { Image, ImageStyle, ImageBackground, Animated } from 'react-native';

interface Props {
  uri: string;
  catchUri: string;
  style?: ImageStyle;
}

interface State {
  source: string;
}

export default class FallbackImage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      source: props.uri,
    };
  }

  render(): JSX.Element {
    return (
      <Image
        source={{ uri: this.state.source }}
        style={this.props.style}
        onError={() => this.setState({ source: this.props.catchUri })}
      />
    );
  }
}

interface AnimatedProps extends Pick<Props, 'uri' | 'catchUri'> {
  style: Animated.WithAnimatedObject<ImageStyle>;
}

export class AnimatedFallbackImage extends React.Component<
  AnimatedProps,
  State
> {
  constructor(props: AnimatedProps) {
    super(props);
    this.state = {
      source: props.uri,
    };
  }

  render(): JSX.Element {
    return (
      <Animated.Image
        source={{ uri: this.state.source }}
        style={this.props.style}
        onError={() => this.setState({ source: this.props.catchUri })}
      />
    );
  }
}

interface PropsWithChildren extends Props {
  children: JSX.Element;
}

export class FallbackImageBackground extends React.Component<
  PropsWithChildren,
  State
> {
  constructor(props: PropsWithChildren) {
    super(props);
    this.state = {
      source: props.uri,
    };
  }

  render(): JSX.Element {
    return (
      <ImageBackground
        source={{ uri: this.state.source }}
        style={this.props.style}
        onError={() => this.setState({ source: this.props.catchUri })}
      >
        {this.props.children}
      </ImageBackground>
    );
  }
}
