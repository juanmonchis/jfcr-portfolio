import { SpringConfig } from "@react-spring/three"

export const FALL_CONFIG: SpringConfig = {
  mass: 2,
  tension: 80,
  friction: 18,
}

export const RETURN_CONFIG: SpringConfig = {
  mass: 1.5,
  tension: 120,
  friction: 22,
}

export const IMMEDIATE_CONFIG: SpringConfig = {
  tension: 1000,
  friction: 100,
}
