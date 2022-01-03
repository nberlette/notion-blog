/* eslint-disable import/no-anonymous-default-export */
import {
  red,
  yellow,
  gray,
  green,
  blue,
  dim,
  bold,
} from 'kleur/colors'
const { time, timeEnd, timeLog, timeStamp, table } = console

function error(...data: any[]): void {
  let label = red(bold('[error]'))
  console.error(label, ...data.map((s) => dim(s)))
}

function warn(...data: any[]): void {
  let label = yellow(bold('[warning]'))
  console.warn(label, ...data.map((s) => dim(s)))
}

function debug(...data: any[]): void {
  let label = blue(bold('[debug]'))
  console.debug(label, ...data.map((s) => dim(s)))
}

function info(...data: any[]): void {
  let label = gray(bold('[info]'))
  console.info(label, ...data.map((s) => dim(s)))
}

function log(...data: any[]): void {
  console.log(...data)
}

function success(...data: any[]): void {
  let label = green(bold('[success]'))
  console.log(label, ...data)
}

function nonFatal(...data: any[]): void {
  let label = red(bold('[error]') + '[non-fatal]')
  console.error(label, ...data)
}

export {
  log,
  success,
  error,
  nonFatal,
  warn,
  info,
  debug,
  time,
  timeEnd,
  timeLog,
  timeStamp,
  table,
}


export default {
  log,
  success,
  error,
  warn,
  nonFatal,
  info,
  debug,
  time,
  timeEnd,
  timeLog,
  timeStamp,
  table,
}
