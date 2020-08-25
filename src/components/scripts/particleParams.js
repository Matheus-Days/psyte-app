export default {
  particles: {
    number: {
      value: 300,
      density: {
        enable: true,
        value_area: 1500,
      },
    },
    color: {
      value: "#ffffcc",
    },
    line_linked: {
      enable: false,
    },
    shape: {
      type: "circle",
    },
    move: {
      direction: "right",
      speed: 0.05,
    },
    size: {
      value: 1,
    },
    opacity: {
      anim: {
        enable: true,
        speed: 1,
        opacity_min: 0.05,
      },
    },
  },
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
    },
    modes: {
      push: {
        particles_nb: 1,
      },
    },
  },
};
