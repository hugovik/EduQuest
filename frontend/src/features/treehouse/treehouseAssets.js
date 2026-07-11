import treehouseSceneDesktop from "../../assets/treehouse/backgrounds/treehouse-scene-desktop.jpg";
import treehouseSceneTablet from "../../assets/treehouse/backgrounds/treehouse-scene-tablet.jpg";
import treehouseSceneMobile from "../../assets/treehouse/backgrounds/treehouse-scene-mobile.jpg";
import professorOwl from "../../assets/treehouse/characters/professor-owl.jpg";
import sparkDragon from "../../assets/treehouse/characters/spark-dragon.jpg";
import treeGrowthWorld from "../../assets/treehouse/growth/tree-growth-world.jpg";

export const treehouseSceneAssets = {
  desktop: treehouseSceneDesktop,
  tablet: treehouseSceneTablet,
  mobile: treehouseSceneMobile,
};

export const treehouseCharacterAssets = {
  professorOwl,
  sparkDragon,
};

export const treeGrowthAssetByStage = {
  "World Tree": {
    src: treeGrowthWorld,
    alt: "A glowing full-grown Tree of Growth",
  },
};

export function getTreeGrowthAsset(stageName) {
  return treeGrowthAssetByStage[stageName] ?? null;
}
