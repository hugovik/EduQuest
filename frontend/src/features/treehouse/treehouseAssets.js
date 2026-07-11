import treehouseSceneDesktop from "../../assets/treehouse/backgrounds/treehouse-scene-desktop.png";
import treehouseSceneTablet from "../../assets/treehouse/backgrounds/treehouse-scene-tablet.png";
import treehouseSceneMobile from "../../assets/treehouse/backgrounds/treehouse-scene-mobile.png";
import professorOwl from "../../assets/treehouse/characters/professor-owl.png";
import sparkDragon from "../../assets/treehouse/characters/spark-dragon.png";
import treeGrowthWorld from "../../assets/treehouse/growth/tree-growth-world.png";

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
