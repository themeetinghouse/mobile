import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import { Platform } from 'react-native';
import * as Linking from 'expo-linking';
import StaffItem from '../staff/StaffItem';
import TeacherItem from '../staff/TeacherItem';

const staffIsTeacher = {
  FirstName: 'Luke',
  LastName: 'Skywalker',
  Email: 'luke.skywalker@themeetinghouse.com',
  Position: 'Jedi',
  Phone: '905-509-1234',
  sites: [],
  Location: null,
  Coordinator: null,
  Teacher: true,
  uri: 'some-uri.png',
};

const staffIsNotTeacher = {
  FirstName: 'Luke',
  LastName: 'Skywalker',
  Email: 'luke.skywalker@themeetinghouse.com',
  Position: 'Jedi',
  Phone: '905-509-1234',
  sites: [],
  Location: null,
  Coordinator: null,
  Teacher: false,
  uri: 'some-uri.png',
};

const staffMissingData = {
  FirstName: 'Luke',
  LastName: '',
  Email: '',
  Position: '',
  Phone: '',
  sites: [],
  Location: null,
  Coordinator: null,
  Teacher: false,
  uri: '',
};

const teacher = {
  id: '123456789',
  name: 'Biggs Darklighter',
  Phone: '905-509-1313',
  Email: 'biggs.darklighter@themeetinghouse.com',
  image: 'picture.jpg',
};

const teacherMissingData = {
  id: '123456789',
  name: '',
  Phone: '',
  Email: '',
  image: '',
};

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

beforeEach(() => {
  mockNavigate.mockReset();
});

describe('staff item', () => {
  test('ios, fallback image', () => {
    Platform.OS = 'ios';

    const { queryByTestId } = render(<StaffItem staff={staffIsTeacher} />);

    expect(queryByTestId('ios-image')).toBeTruthy();

    act(() => {
      queryByTestId('ios-image').props.onError();
    });

    expect(queryByTestId('fallback-image')).toBeTruthy();
  });

  test('ios, image loads', () => {
    Platform.OS = 'ios';

    const { queryByTestId } = render(<StaffItem staff={staffIsTeacher} />);

    expect(queryByTestId('ios-image')).toBeTruthy();

    act(() => {
      queryByTestId('ios-image').props.onLoadEnd();
    });

    expect(queryByTestId('fallback-image')).toBeFalsy();
  });

  test('android, fallback image', () => {
    Platform.OS = 'android';

    const { queryByTestId } = render(<StaffItem staff={staffIsTeacher} />);

    expect(queryByTestId('android-image')).toBeTruthy();

    act(() => {
      queryByTestId('android-image').props.onError();
    });

    expect(queryByTestId('fallback-image')).toBeTruthy();
  });

  test('android, image loads', () => {
    Platform.OS = 'android';

    const { queryByTestId } = render(<StaffItem staff={staffIsTeacher} />);

    expect(queryByTestId('android-image')).toBeTruthy();

    act(() => {
      queryByTestId('android-image').props.onLoadEnd();
    });

    expect(queryByTestId('fallback-image')).toBeFalsy();
  });

  test('teacher = true, navigation', () => {
    const { queryByText } = render(<StaffItem staff={staffIsTeacher} />);

    expect(queryByText('View Teaching')).toBeTruthy();

    const button = queryByText('View Teaching');

    fireEvent.press(button);

    expect(mockNavigate).toHaveBeenCalledWith('TeacherProfile', {
      staff: staffIsTeacher,
    });
  });

  test('teacher = false', () => {
    const { queryByText } = render(<StaffItem staff={staffIsNotTeacher} />);

    expect(queryByText('View Teaching')).toBeFalsy();
  });

  test('email, phone', () => {
    Linking.openURL = jest.fn();

    const { queryByTestId } = render(<StaffItem staff={staffIsTeacher} />);

    const tel = queryByTestId('tel-btn');
    const email = queryByTestId('email-btn');

    fireEvent.press(tel);
    expect(Linking.openURL).toHaveBeenCalledWith(`tel:${staffIsTeacher.Phone}`);

    fireEvent.press(email);
    expect(Linking.openURL).toHaveBeenCalledWith(
      `mailto:${staffIsTeacher.Email}`
    );
  });

  test('missing data', () => {
    const { queryByTestId, queryByText } = render(
      <StaffItem staff={staffMissingData} />
    );

    expect(queryByText('View Teaching')).toBeFalsy();
    expect(queryByTestId('tel-btn')).toBeFalsy();
    expect(queryByTestId('email-btn')).toBeFalsy();
    expect(queryByTestId('staff-name')).toBeFalsy();
    expect(queryByTestId('staff-position')).toBeFalsy();
  });
});

describe('teacher item', () => {
  test('ios, fallback image', () => {
    Platform.OS = 'ios';

    const { queryByTestId } = render(<TeacherItem teacher={teacher} />);

    expect(queryByTestId('ios-image')).toBeTruthy();

    act(() => {
      queryByTestId('ios-image').props.onError();
    });

    expect(queryByTestId('fallback-image')).toBeTruthy();
  });

  test('ios, image loads', () => {
    Platform.OS = 'ios';

    const { queryByTestId } = render(<TeacherItem teacher={teacher} />);

    expect(queryByTestId('ios-image')).toBeTruthy();

    act(() => {
      queryByTestId('ios-image').props.onLoadEnd();
    });

    expect(queryByTestId('fallback-image')).toBeFalsy();
  });

  test('android, fallback image', () => {
    Platform.OS = 'android';

    const { queryByTestId } = render(<TeacherItem teacher={teacher} />);

    expect(queryByTestId('android-image')).toBeTruthy();

    act(() => {
      queryByTestId('android-image').props.onError();
    });

    expect(queryByTestId('fallback-image')).toBeTruthy();
  });

  test('android, image loads', () => {
    Platform.OS = 'android';

    const { queryByTestId } = render(<TeacherItem teacher={teacher} />);

    expect(queryByTestId('android-image')).toBeTruthy();

    act(() => {
      queryByTestId('android-image').props.onLoadEnd();
    });

    expect(queryByTestId('fallback-image')).toBeFalsy();
  });

  test('email, phone', () => {
    Linking.openURL = jest.fn();

    const { queryByTestId } = render(<TeacherItem teacher={teacher} />);

    const tel = queryByTestId('tel-btn');
    const email = queryByTestId('email-btn');

    fireEvent.press(tel);
    expect(Linking.openURL).toHaveBeenCalledWith(`tel:${teacher.Phone}`);

    fireEvent.press(email);
    expect(Linking.openURL).toHaveBeenCalledWith(`mailto:${teacher.Email}`);
  });

  test('missing data', () => {
    const { queryByTestId } = render(
      <TeacherItem teacher={teacherMissingData} />
    );

    expect(queryByTestId('tel-btn')).toBeFalsy();
    expect(queryByTestId('email-btn')).toBeFalsy();
    expect(queryByTestId('teacher-name')).toBeFalsy();
  });

  test('navigation', () => {
    const { queryByTestId } = render(<TeacherItem teacher={teacher} />);

    const touchable = queryByTestId('go-to-teacher');
    fireEvent.press(touchable);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('TeacherProfile', {
      staff: { idFromTeaching: teacher.id },
    });
  });
});
