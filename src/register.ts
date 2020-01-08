import { register } from '@storybook/addon-devkit'

import { Panel } from './components'
import './config'

register({}, ({ global, local }) => ({}))(Panel)
