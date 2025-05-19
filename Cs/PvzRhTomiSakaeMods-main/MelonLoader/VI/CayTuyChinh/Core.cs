using CayTuyChinh;
using HarmonyLib;
using Il2CppInterop.Runtime;
using Il2CppTMPro;
using MelonLoader;
using System.Diagnostics.CodeAnalysis;
using System.Reflection;
using Unity.VisualScripting;
using UnityEngine;
using Il2Cpp;

[assembly: MelonInfo(typeof(CustomCore), "PvzRhTomiSakaeMods v1.1 - CayTuyChinh", "1.1.0", "TomiSakae", null)]
[assembly: MelonGame("LanPiaoPiao", "PlantsVsZombiesRH")]
[assembly: MelonPlatformDomain(MelonPlatformDomainAttribute.CompatibleDomains.IL2CPP)]

namespace CayTuyChinh
{
    public struct CustomPlantData
    {
        public int ID { get; set; }
        public PlantDataLoader.PlantData_ PlantData { get; set; }
        public GameObject Prefab { get; set; }
        public GameObject Preview { get; set; }
    }

    [HarmonyPatch(typeof(AlmanacPlantBank))]
    public static class AlmanacMgrPatch
    {
        [HarmonyPatch("InitNameAndInfoFromJson")]
        [HarmonyPrefix]
        public static bool PreInitNameAndInfoFromJson(AlmanacPlantBank __instance)
        {
            if (CustomCore.PlantsAlmanac.ContainsKey((PlantType)__instance.theSeedType))
            {
                for (int i = 0; i < __instance.transform.childCount; i++)
                {
                    Transform childTransform = __instance.transform.GetChild(i);
                    if (childTransform == null)
                        continue;
                    if (childTransform.name == "Name")
                    {
                        childTransform.GetComponent<TextMeshPro>().text = CustomCore.PlantsAlmanac[(PlantType)__instance.theSeedType].Item1;
                        childTransform.GetChild(0).GetComponent<TextMeshPro>().text = CustomCore.PlantsAlmanac[(PlantType)__instance.theSeedType].Item1;
                    }
                    if (childTransform.name == "Info")
                    {
                        TextMeshPro info = childTransform.GetComponent<TextMeshPro>();
                        info.overflowMode = TextOverflowModes.Page;
                        info.fontSize = 30;
                        info.text = CustomCore.PlantsAlmanac[(PlantType)__instance.theSeedType].Item2;
                        __instance.introduce = info;
                    }
                    if (childTransform.name == "Cost")
                        childTransform.GetComponent<TextMeshPro>().text = "";
                }
                return false;
            }
            return true;
        }

        [HarmonyPatch("OnMouseDown")]
        [HarmonyPrefix]
        public static bool PreOnMouseDown(AlmanacPlantBank __instance)
        {
            __instance.introduce = __instance.gameObject.transform.FindChild("Info").gameObject.GetComponent<TextMeshPro>();
            __instance.pageCount = __instance.introduce.m_pageNumber * 1;
            if (__instance.currentPage <= __instance.introduce.m_pageNumber)
                ++__instance.currentPage;
            else
                __instance.currentPage = 1;
            __instance.introduce.pageToDisplay = __instance.currentPage;

            return false;
        }
    }

    [HarmonyPatch(typeof(AlmanacMgrZombie))]
    public static class AlmanacMgrZombiePatch
    {
        [HarmonyPatch("InitNameAndInfoFromJson")]
        [HarmonyPrefix]
        public static bool PreInitNameAndInfoFromJson(AlmanacMgrZombie __instance)
        {
            if (CustomCore.ZombiesAlmanac.ContainsKey(__instance.theZombieType))
            {
                for (int i = 0; i < __instance.transform.childCount; i++)
                {
                    Transform childTransform = __instance.transform.GetChild(i);
                    if (childTransform == null)
                        continue;
                    if (childTransform.name == "Name")
                    {
                        childTransform.GetComponent<TextMeshPro>().text = CustomCore.ZombiesAlmanac[__instance.theZombieType].Item1;
                        childTransform.GetChild(0).GetComponent<TextMeshPro>().text = CustomCore.ZombiesAlmanac[__instance.theZombieType].Item1;
                    }
                    if (childTransform.name == "Info")
                    {
                        TextMeshPro info = childTransform.GetComponent<TextMeshPro>();
                        info.overflowMode = TextOverflowModes.Page;
                        info.fontSize = 40;
                        info.text = CustomCore.ZombiesAlmanac[__instance.theZombieType].Item2;
                        __instance.introduce = info;
                    }
                    if (childTransform.name == "Cost")
                        childTransform.GetComponent<TextMeshPro>().text = "";
                }
                return false;
            }
            return true;
        }
    }

    [HarmonyPatch(typeof(AlmanacZombieCtrl))]
    public static class AlmanacZombieCtrlPatch
    {
        [HarmonyPatch("Awake")]
        [HarmonyPostfix]
        public static void PostAwake(AlmanacZombieCtrl __instance)
        {
            var transform = __instance.gameObject.transform.GetChild(1).GetChild(3).GetChild(0).GetChild(0);
            var template = transform.GetChild(0).gameObject;
            int row = 1;
            int col = 0;
            foreach (var z in CustomCore.CustomZombies)
            {
                var button = UnityEngine.Object.Instantiate(template, new(-7.5f + 1.8f * col, 2.5f - 1.8f * row, 0), new(0, 0, 0, 0), transform);
                button.transform.GetChild(0).gameObject.GetComponent<SpriteRenderer>().sprite = GameAPP.spritePrefab[z.Value.Item2];
                if (++col > 6)
                {
                    col = 0;
                    row++;
                }
                button.GetComponent<AlmanacCardZombie>().theZombieType = (ZombieType)z.Key;
            }
        }
    }

    [HarmonyPatch(typeof(CreatePlant), "SetPlant")]
    public static class CreatePlantPatch
    {
        public static void Postfix(ref GameObject __result)
        {
            if (__result is not null && __result.TryGetComponent<Plant>(out var plant) && CustomCore.CustomPlantTypes.Contains(plant.thePlantType))
            {
                TypeMgr.GetPlantTag(plant);
            }
        }
    }

    public static class Extensions
    {
        public static void DisableDisMix(this Plant plant) => (plant.firstParent, plant.secondParent) = (PlantType.Nothing, PlantType.Nothing);

        public static T GetAsset<T>(this AssetBundle ab, string name) where T : UnityEngine.Object
        {
            foreach (var ase in ab.LoadAllAssetsAsync().allAssets)
            {
                if (ase.TryCast<T>()?.name == name)
                {
                    return ase.Cast<T>();
                }
            }
            throw new ArgumentException($"Could not find {name} from {ab.name}");
        }

        public static int GetTotalHealth(this Zombie zombie) => (int)zombie.theHealth + zombie.theFirstArmorHealth + zombie.theSecondArmorHealth;

        public static bool ObjectExist<T>(this Board board) => board.GameObject().transform.GetComponentsInChildren<T>().Length > 0;
    }

    [HarmonyPatch(typeof(GameAPP))]
    public static class GameAPPPatch
    {
        [HarmonyPostfix]
        [HarmonyPatch("LoadResources")]
        public static void LoadResources()
        {
            foreach (var plant in CustomCore.CustomPlants)
            {
                GameAPP.resourcesManager.plantPrefabs[plant.Key] = plant.Value.Prefab;
                GameAPP.resourcesManager.plantPrefabs[plant.Key].tag = "Plant";
                GameAPP.resourcesManager.allPlants.Add(plant.Key);
                PlantDataLoader.plantData[(int)plant.Key] = plant.Value.PlantData;
                PlantDataLoader.plantDatas.Add(plant.Key, plant.Value.PlantData);
                GameAPP.resourcesManager.plantPreviews[plant.Key] = plant.Value.Preview;
                GameAPP.resourcesManager.plantPreviews[plant.Key].tag = "Preview";
            }
            Il2CppSystem.Array array = MixData.data.Cast<Il2CppSystem.Array>();
            foreach (var f in CustomCore.CustomFusions)
            {
                array.SetValue(f.Item1, f.Item2, f.Item3);
            }
            foreach (var z in CustomCore.CustomZombies)
            {
                GameAPP.zombiePrefab[z.Key] = z.Value.Item1;
                GameAPP.zombiePrefab[z.Key].tag = "Zombie";
            }
            foreach (var bullet in CustomCore.CustomBullets)
            {
                GameAPP.resourcesManager.bulletPrefabs[bullet.Key] = bullet.Value;
                GameAPP.resourcesManager.allBullets.Add(bullet.Key);
            }
            foreach (var par in CustomCore.CustomParticles)
            {
                GameAPP.particlePrefab[par.Key] = par.Value;
                GameAPP.resourcesManager.particlePrefabs[(ParticleType)par.Key] = par.Value;
                GameAPP.resourcesManager.allParticles.Add((ParticleType)par.Key);
            }
            foreach (var spr in CustomCore.CustomSprites)
            {
                GameAPP.spritePrefab[spr.Key] = spr.Value;
            }
        }
    }

    [HarmonyPatch(typeof(Money))]
    public static class MoneyPatch
    {
        [HarmonyPrefix]
        [HarmonyPatch("ReinforcePlant")]
        public static bool PreReinforcePlant(Money __instance, ref Plant plant)
        {
            if (CustomCore.SuperSkills.ContainsKey(plant.thePlantType))
            {
                var cost = CustomCore.SuperSkills[plant.thePlantType].Item1(plant);

                if (Board.Instance.theMoney < cost)
                {
                    InGameText.Instance.ShowText($"������Ҫ{cost}���", 5);
                    return false;
                }
                if (plant.SuperSkill())
                {
                    CustomCore.SuperSkills[plant.thePlantType].Item2(plant);
                    plant.AnimSuperShoot();
                    __instance.UsedEvent(plant.thePlantColumn, plant.thePlantRow, cost);
                    __instance.OtherSuperSkill(plant);
                }
                return false;
            }
            return true;
        }
    }

    [HarmonyPatch(typeof(Mouse))]
    public static class MousePatch
    {
        [HarmonyPostfix]
        [HarmonyPatch("GetPlantsOnMouse")]
        public static void PostGetPlantsOnMouse(ref Il2CppSystem.Collections.Generic.List<Plant> __result)
        {
            for (int i = __result.Count - 1; i >= 0; i--)
            {
                if (__result[i] is not null && TypeMgr.BigNut(__result[i].thePlantType))
                {
                    __result.RemoveAt(i);
                }
            }
        }

        [HarmonyPostfix]
        [HarmonyPatch("LeftClickWithNothing")]
        public static void PostLeftClickWithNothing(Mouse __instance)
        {
            foreach (GameObject gameObject in (List<GameObject>)[..from RaycastHit2D raycastHit2D in
                                           (RaycastHit2D[])Physics2D.RaycastAll(Camera.main.ScreenToWorldPoint(Input.mousePosition),
                                           Vector2.zero) select raycastHit2D.collider.gameObject])
            {
                if (gameObject.TryGetComponent<Plant>(out var plant) && CustomCore.CustomPlantClicks.ContainsKey(plant.thePlantType))
                {
                    CustomCore.CustomPlantClicks[plant.thePlantType](plant);
                    return;
                }
            }
        }
    }

    [HarmonyPatch(typeof(Plant))]
    public static class PlantPatch
    {
        [HarmonyPostfix]
        [HarmonyPatch("UseItem")]
        public static void PostUseItem(Plant __instance, ref BucketType type, ref Bucket bucket)
        {
            if (CustomCore.CustomUseItems.ContainsKey((__instance.thePlantType, type)))
            {
                CustomCore.CustomUseItems[(__instance.thePlantType, type)](__instance);
                UnityEngine.Object.Destroy(bucket.gameObject);
            }
        }
    }

    [HarmonyPatch(typeof(TravelBuff))]
    public static class TravelBuffPatch
    {
        [HarmonyPrefix]
        [HarmonyPatch("ChangeSprite")]
        public static void PreChangeSprite(TravelBuff __instance)
        {
            if (__instance.theBuffType == 1 && CustomCore.CustomAdvancedBuffs.ContainsKey(__instance.theBuffNumber))
            {
                __instance.thePlantType = CustomCore.CustomAdvancedBuffs[__instance.theBuffNumber].Item1;
            }
            if (__instance.theBuffType == 2 && CustomCore.CustomUltimateBuffs.ContainsKey(__instance.theBuffNumber))
            {
                __instance.thePlantType = CustomCore.CustomUltimateBuffs[__instance.theBuffNumber].Item1;
            }
        }
    }

    [HarmonyPatch(typeof(TravelMenuMgr))]
    public static class TravelMenuMgrPatch
    {
        [HarmonyPostfix]
        [HarmonyPatch("SetText")]
        public static void PostSetText(TravelMenuMgr __instance)
        {
            for (int i = 0; i < 3; i++)
            {
                int type = __instance.options[i].optionType;
                int number = __instance.options[i].optionNumber;
                if (type is 1 && CustomCore.CustomAdvancedBuffs.ContainsKey(number) && CustomCore.CustomAdvancedBuffs[number].Item5 is not null)
                {
                    __instance.textMesh[i].text = $"<color={CustomCore.CustomAdvancedBuffs[number].Item5}>{__instance.textMesh[i].text}</color>";
                }
                if (type is 2 && CustomCore.CustomUltimateBuffs.ContainsKey(number) && CustomCore.CustomUltimateBuffs[number].Item4 is not null)
                {
                    __instance.textMesh[i].text = $"<color={CustomCore.CustomUltimateBuffs[number].Item4}>{__instance.textMesh[i].text}</color>";
                }
            }
        }
    }

    [HarmonyPatch(typeof(TravelMgr))]
    public static class TravelMgrPatch
    {
        [HarmonyPatch("Awake")]
        [HarmonyPrefix]
        public static void PostAwake(TravelMgr __instance)
        {
            if (CustomCore.CustomAdvancedBuffs.Count > 0)
            {
                bool[] newAdv = new bool[__instance.advancedUpgrades.Count + CustomCore.CustomAdvancedBuffs.Count];
                int[] newAdvUnlock = new int[__instance.advancedUnlockRound.Count + CustomCore.CustomAdvancedBuffs.Count];
                Array.Copy(__instance.advancedUpgrades, newAdv, __instance.advancedUpgrades.Length);
                Array.Copy(__instance.advancedUnlockRound, newAdvUnlock, __instance.advancedUnlockRound.Length);
                __instance.advancedUpgrades = newAdv;
                __instance.advancedUnlockRound = newAdvUnlock;
            }
            if (CustomCore.CustomUltimateBuffs.Count > 0)
            {
                bool[] newUlti = new bool[__instance.ultimateUpgrades.Count + CustomCore.CustomUltimateBuffs.Count];
                Array.Copy(__instance.ultimateUpgrades, newUlti, __instance.ultimateUpgrades.Length);
                __instance.ultimateUpgrades = newUlti;
            }
            if (CustomCore.CustomDebuffs.Count > 0)
            {
                bool[] newdeb = new bool[__instance.debuff.Count + CustomCore.CustomDebuffs.Count];
                Array.Copy(__instance.debuff, newdeb, __instance.debuff.Length);
                __instance.debuff = newdeb;
            }
        }

        [HarmonyPatch("GetAdvancedBuffPool")]
        [HarmonyPostfix]
        public static void PostGetAdvancedBuffPool(TravelMgr __instance, ref Il2CppSystem.Collections.Generic.List<int> __result)
        {
            for (int i = __result.Count - 1; i >= 0; i--)
            {
                if (CustomCore.CustomAdvancedBuffs.ContainsKey(__result[i]) && !CustomCore.CustomAdvancedBuffs[__result[i]].Item3())
                {
                    __result.Remove(__result[i]);
                }
            }
        }
    }

    [HarmonyPatch(typeof(TravelStore))]
    public static class TravelStorePatch
    {
        [HarmonyPatch("RefreshBuff")]
        [HarmonyPostfix]
        public static void PostRefreshBuff(TravelStore __instance)
        {
            foreach (var travelBuff in __instance.gameObject.GetComponentsInChildren<TravelBuff>())
            {
                if (travelBuff.theBuffType is (int)BuffType.AdvancedBuff && CustomCore.CustomAdvancedBuffs.ContainsKey(travelBuff.theBuffNumber))
                {
                    travelBuff.cost = CustomCore.CustomAdvancedBuffs[travelBuff.theBuffNumber].Item4;
                    travelBuff.transform.GetChild(1).gameObject.GetComponent<TextMeshProUGUI>().text = $"��{CustomCore.CustomAdvancedBuffs[travelBuff.theBuffNumber].Item4}";
                }
                if (travelBuff.theBuffType is (int)BuffType.UltimateBuff && CustomCore.CustomUltimateBuffs.ContainsKey(travelBuff.theBuffNumber))
                {
                    travelBuff.cost = CustomCore.CustomUltimateBuffs[travelBuff.theBuffNumber].Item3;
                    travelBuff.transform.GetChild(1).gameObject.GetComponent<TextMeshProUGUI>().text = $"��{CustomCore.CustomUltimateBuffs[travelBuff.theBuffNumber].Item4}";
                }
            }
        }
    }

    [HarmonyPatch(typeof(TypeMgr))]
    public static class TypeMgrPatch
    {
        [HarmonyPrefix]
        [HarmonyPatch("BigNut")]
        public static bool PreBigNut(ref PlantType theSeedType, ref bool __result)
        {
            if (CustomCore.TypeMgrExtra.BigNut.Contains(theSeedType))
            {
                __result = true;
                return false;
            }
            return true;
        }

        [HarmonyPrefix]
        [HarmonyPatch("BigZombie")]
        public static bool PreBigZombie(ref ZombieType theZombieType, ref bool __result)
        {
            if (CustomCore.TypeMgrExtra.BigZombie.Contains(theZombieType))
            {
                __result = true;
                return false;
            }
            return true;
        }

        [HarmonyPrefix]
        [HarmonyPatch("DoubleBoxPlants")]
        public static bool PreDoubleBoxPlants(ref PlantType thePlantType, ref bool __result)
        {
            if (CustomCore.TypeMgrExtra.DoubleBoxPlants.Contains(thePlantType))
            {
                __result = true;
                return false;
            }
            return true;
        }

        [HarmonyPrefix]
        [HarmonyPatch("EliteZombie")]
        public static bool PreEliteZombie(ref ZombieType theZombieType, ref bool __result)
        {
            if (CustomCore.TypeMgrExtra.EliteZombie.Contains(theZombieType))
            {
                __result = true;
                return false;
            }
            return true;
        }

        [HarmonyPrefix]
        [HarmonyPatch("FlyingPlants")]
        public static bool PreFlyingPlants(ref PlantType thePlantType, ref bool __result)
        {
            if (CustomCore.TypeMgrExtra.FlyingPlants.Contains(thePlantType))
            {
                __result = true;
                return false;
            }
            return true;
        }

        [HarmonyPrefix]
        [HarmonyPatch("GetPlantTag")]
        public static bool PreGetPlantTag(ref Plant plant)
        {
            if (CustomCore.CustomPlantTypes.Contains(plant.thePlantType))
            {
                plant.plantTag = new()
                {
                    icePlant = TypeMgr.IsIcePlant(plant.thePlantType),
                    caltropPlant = TypeMgr.IsCaltrop(plant.thePlantType),
                    doubleBoxPlant = TypeMgr.DoubleBoxPlants(plant.thePlantType),
                    firePlant = TypeMgr.IsFirePlant(plant.thePlantType),
                    flyingPlant = TypeMgr.FlyingPlants(plant.thePlantType),
                    lanternPlant = TypeMgr.IsPlantern(plant.thePlantType),
                    smallLanternPlant = TypeMgr.IsSmallRangeLantern(plant.thePlantType),
                    magnetPlant = TypeMgr.IsMagnetPlants(plant.thePlantType),
                    nutPlant = TypeMgr.IsNut(plant.thePlantType),
                    tallNutPlant = TypeMgr.IsTallNut(plant.thePlantType),
                    potatoPlant = TypeMgr.IsPotatoMine(plant.thePlantType),
                    potPlant = TypeMgr.IsPot(plant.thePlantType),
                    puffPlant = TypeMgr.IsPuff(plant.thePlantType),
                    pumpkinPlant = TypeMgr.IsPumpkin(plant.thePlantType),
                    spickRockPlant = TypeMgr.IsSpickRock(plant.thePlantType),
                    tanglekelpPlant = TypeMgr.IsTangkelp(plant.thePlantType),
                    waterPlant = TypeMgr.IsWaterPlant(plant.thePlantType)
                };

                return false;
            }
            return true;
        }

        [HarmonyPrefix]
        [HarmonyPatch("IsAirZombie")]
        public static bool PreIsAirZombie(ref ZombieType theZombieType, ref bool __result)
        {
            if (CustomCore.TypeMgrExtra.IsAirZombie.Contains(theZombieType))
            {
                __result = true;
                return false;
            }
            return true;
        }

        [HarmonyPrefix]
        [HarmonyPatch("IsCaltrop")]
        public static bool PreIsCaltrop(ref PlantType theSeedType, ref bool __result)
        {
            if (CustomCore.TypeMgrExtra.IsCaltrop.Contains(theSeedType))
            {
                __result = true;
                return false;
            }
            return true;
        }

        [HarmonyPrefix]
        [HarmonyPatch("IsFirePlant")]
        public static bool PreIsFirePlant(ref PlantType theSeedType, ref bool __result)
        {
            if (CustomCore.TypeMgrExtra.IsFirePlant.Contains(theSeedType))
            {
                __result = true;
                return false;
            }
            return true;
        }

        [HarmonyPrefix]
        [HarmonyPatch("IsIcePlant")]
        public static bool PreIsIcePlant(ref PlantType theSeedType, ref bool __result)
        {
            if (CustomCore.TypeMgrExtra.IsIcePlant.Contains(theSeedType))
            {
                __result = true;
                return false;
            }
            return true;
        }

        [HarmonyPrefix]
        [HarmonyPatch("IsMagnetPlants")]
        public static bool PreIsMagnetPlants(ref PlantType thePlantType, ref bool __result)
        {
            if (CustomCore.TypeMgrExtra.IsMagnetPlants.Contains(thePlantType))
            {
                __result = true;
                return false;
            }
            return true;
        }

        [HarmonyPrefix]
        [HarmonyPatch("IsNut")]
        public static bool PreIsNut(ref PlantType theSeedType, ref bool __result)
        {
            if (CustomCore.TypeMgrExtra.IsNut.Contains(theSeedType))
            {
                __result = true;
                return false;
            }
            return true;
        }

        [HarmonyPrefix]
        [HarmonyPatch("IsPlantern")]
        public static bool PreIsPlantern(ref PlantType theSeedType, ref bool __result)
        {
            if (CustomCore.TypeMgrExtra.IsPlantern.Contains(theSeedType))
            {
                __result = true;
                return false;
            }
            return true;
        }

        [HarmonyPrefix]
        [HarmonyPatch("IsPot")]
        public static bool PreIsPot(ref PlantType thePlantType, ref bool __result)
        {
            if (CustomCore.TypeMgrExtra.IsPot.Contains(thePlantType))
            {
                __result = true;
                return false;
            }
            return true;
        }

        [HarmonyPrefix]
        [HarmonyPatch("IsPotatoMine")]
        public static bool PreIsPotatoMine(ref PlantType theSeedType, ref bool __result)
        {
            if (CustomCore.TypeMgrExtra.IsPotatoMine.Contains(theSeedType))
            {
                __result = true;
                return false;
            }
            return true;
        }

        [HarmonyPrefix]
        [HarmonyPatch("IsPuff")]
        public static bool PreIsPuff(ref PlantType theSeedType, ref bool __result)
        {
            if (CustomCore.TypeMgrExtra.IsPuff.Contains(theSeedType))
            {
                __result = true;
                return false;
            }
            return true;
        }

        [HarmonyPrefix]
        [HarmonyPatch("IsPumpkin")]
        public static bool PreIsPumpkin(ref PlantType theSeedType, ref bool __result)
        {
            if (CustomCore.TypeMgrExtra.IsPumpkin.Contains(theSeedType))
            {
                __result = true;
                return false;
            }
            return true;
        }

        [HarmonyPrefix]
        [HarmonyPatch("IsSmallRangeLantern")]
        public static bool PreIsSmallRangeLantern(ref PlantType theSeedType, ref bool __result)
        {
            if (CustomCore.TypeMgrExtra.IsSmallRangeLantern.Contains(theSeedType))
            {
                __result = true;
                return false;
            }
            return true;
        }

        [HarmonyPrefix]
        [HarmonyPatch("IsSpecialPlant")]
        public static bool PreIsSpecialPlant(ref PlantType theSeedType, ref bool __result)
        {
            if (CustomCore.TypeMgrExtra.IsSpecialPlant.Contains(theSeedType))
            {
                __result = true;
                return false;
            }
            return true;
        }

        [HarmonyPrefix]
        [HarmonyPatch("IsSpickRock")]
        public static bool PreIsSpickRock(ref PlantType theSeedType, ref bool __result)
        {
            if (CustomCore.TypeMgrExtra.IsSpickRock.Contains(theSeedType))
            {
                __result = true;
                return false;
            }
            return true;
        }

        [HarmonyPrefix]
        [HarmonyPatch("IsTallNut")]
        public static bool PreIsTallNut(ref PlantType theSeedType, ref bool __result)
        {
            if (CustomCore.TypeMgrExtra.IsTallNut.Contains(theSeedType))
            {
                __result = true;
                return false;
            }
            return true;
        }

        [HarmonyPrefix]
        [HarmonyPatch("IsTangkelp")]
        public static bool PreIsTangkelp(ref PlantType theSeedType, ref bool __result)
        {
            if (CustomCore.TypeMgrExtra.IsTangkelp.Contains(theSeedType))
            {
                __result = true;
                return false;
            }
            return true;
        }

        [HarmonyPrefix]
        [HarmonyPatch("IsWaterPlant")]
        public static bool PreIsWaterPlant(ref PlantType theSeedType, ref bool __result)
        {
            if (CustomCore.TypeMgrExtra.IsWaterPlant.Contains(theSeedType))
            {
                __result = true;
                return false;
            }
            return true;
        }

        [HarmonyPrefix]
        [HarmonyPatch("UmbrellaPlants")]
        public static bool PreUmbrellaPlants(ref PlantType thePlantType, ref bool __result)
        {
            if (CustomCore.TypeMgrExtra.UmbrellaPlants.Contains(thePlantType))
            {
                __result = true;
                return false;
            }
            return true;
        }
    }

    public class CustomCore : MelonMod
    {
        public static class TypeMgrExtra
        {
            public static List<PlantType> BigNut { get; set; } = [];
            public static List<ZombieType> BigZombie { get; set; } = [];
            public static List<PlantType> DoubleBoxPlants { get; set; } = [];
            public static List<ZombieType> EliteZombie { get; set; } = [];
            public static List<PlantType> FlyingPlants { get; set; } = [];
            public static List<ZombieType> IsAirZombie { get; set; } = [];
            public static List<PlantType> IsCaltrop { get; set; } = [];
            public static List<PlantType> IsCustomPlant { get; set; } = [];
            public static List<PlantType> IsFirePlant { get; set; } = [];
            public static List<PlantType> IsIcePlant { get; set; } = [];
            public static List<PlantType> IsMagnetPlants { get; set; } = [];
            public static List<PlantType> IsNut { get; set; } = [];
            public static List<PlantType> IsPlantern { get; set; } = [];
            public static List<PlantType> IsPot { get; set; } = [];
            public static List<PlantType> IsPotatoMine { get; set; } = [];
            public static List<PlantType> IsPuff { get; set; } = [];
            public static List<PlantType> IsPumpkin { get; set; } = [];
            public static List<PlantType> IsSmallRangeLantern { get; set; } = [];
            public static List<PlantType> IsSpecialPlant { get; set; } = [];
            public static List<PlantType> IsSpickRock { get; set; } = [];
            public static List<PlantType> IsTallNut { get; set; } = [];
            public static List<PlantType> IsTangkelp { get; set; } = [];
            public static List<PlantType> IsWaterPlant { get; set; } = [];
            public static List<ZombieType> NotRandomBungiZombie { get; set; } = [];
            public static List<ZombieType> NotRandomZombie { get; set; } = [];
            public static List<ZombieType> UltimateZombie { get; set; } = [];
            public static List<PlantType> UmbrellaPlants { get; set; } = [];
            public static List<ZombieType> UselessHypnoZombie { get; set; } = [];
            public static List<ZombieType> WaterZombie { get; set; } = [];
        }

        public static void AddFusion(int target, int item1, int item2) => CustomFusions.Add((target, item1, item2));

        public static void AddPlantAlmanacStrings(int id, string name, string description) => PlantsAlmanac.Add((PlantType)id, (name, description));

        public static void AddZombieAlmanacStrings(int id, string name, string description) => ZombiesAlmanac.Add((ZombieType)id, (name, description));

        public static AssetBundle GetAssetBundle(Assembly assembly, string name)
        {
            try
            {
                using Stream stream = assembly.GetManifestResourceStream(assembly.FullName!.Split(",")[0] + "." + name) ?? assembly.GetManifestResourceStream(name)!;
                using MemoryStream stream1 = new();
                stream.CopyTo(stream1);
                var ab = AssetBundle.LoadFromMemory(stream1.ToArray());
                ArgumentNullException.ThrowIfNull(ab);
                MelonLogger.Msg($"Successfully load AssetBundle {name}.");
                return ab;
            }
            catch (Exception e)
            {
                throw new ArgumentException($"Failed to load {name} \n{e}");
            }
        }

        public static int RegisterCustomBuff(string text, BuffType buffType, Func<bool> canUnlock, int cost, string? color = null, PlantType plantType = PlantType.Nothing)
        {
            switch (buffType)
            {
                case BuffType.AdvancedBuff:
                    {
                        int i = TravelMgr.advancedBuffs.Count;
                        CustomAdvancedBuffs.Add(i, (plantType, text, canUnlock, cost, color));
                        TravelMgr.advancedBuffs.Add(i, text);
                        return i;
                    }
                case BuffType.UltimateBuff:
                    {
                        int i = TravelMgr.ultimateBuffs.Count;
                        CustomUltimateBuffs.Add(i, (plantType, text, cost, color));
                        TravelMgr.ultimateBuffs.Add(i, text);
                        return i;
                    }
                case BuffType.Debuff:
                    {
                        int i = TravelMgr.debuffs.Count;
                        CustomDebuffs.Add(i, text);
                        TravelMgr.debuffs.Add(i, text);
                        return i;
                    }
                default:
                    return -1;
            }
        }

        public static void RegisterCustomBullet<TBullet>(int id, GameObject bulletPrefab) where TBullet : Bullet
        {
            if (!CustomBullets.ContainsKey((BulletType)id))
            {
                bulletPrefab.AddComponent<TBullet>().theBulletType = (BulletType)id;
                CustomBullets.Add((BulletType)id, bulletPrefab);
            }
            else
            {
                MelonLogger.Error($"Duplicate Bullet ID: {id}");
            }
        }

        public static void RegisterCustomBullet<TBase, TBullet>(int id, GameObject bulletPrefab) where TBase : Bullet where TBullet : MonoBehaviour
        {
            if (!CustomBullets.ContainsKey((BulletType)id))
            {
                bulletPrefab.AddComponent<TBase>().theBulletType = (BulletType)id;
                bulletPrefab.AddComponent<TBullet>();
                CustomBullets.Add((BulletType)id, bulletPrefab);
            }
            else
            {
                MelonLogger.Error($"Duplicate Bullet ID: {id}");
            }
        }

        public static void RegisterCustomParticle(int id, GameObject particle) => CustomParticles.Add(id, particle);

        public static void RegisterCustomPlant<TBase, TClass>([NotNull] int id, [NotNull] GameObject prefab, [NotNull] GameObject preview,
                    List<(int, int)> fusions, float attackInterval, float produceInterval, int attackDamage, int maxHealth, float cd, int sun)
                    where TBase : Plant where TClass : MonoBehaviour
        {
            prefab.AddComponent<TBase>().thePlantType = (PlantType)id;
            prefab.AddComponent<TClass>();
            if (!CustomPlantTypes.Contains((PlantType)id))
            {
                CustomPlantTypes.Add((PlantType)id);
                CustomPlants.Add((PlantType)id, new CustomPlantData()
                {
                    ID = id,
                    Prefab = prefab,
                    Preview = preview,
                    PlantData = new()
                    {
                        attackDamage = attackDamage,
                        field_Public_PlantType_0 = (PlantType)id,
                        field_Public_Single_0 = attackInterval,
                        field_Public_Single_1 = produceInterval,
                        field_Public_Int32_0 = maxHealth,
                        field_Public_Single_2 = cd,
                        field_Public_Int32_1 = sun
                    }
                });
                foreach (var f in fusions)
                {
                    AddFusion(id, f.Item1, f.Item2);
                }
            }
            else
            {
                MelonLogger.Error($"Duplicate Plant ID: {id}");
            }
        }

        public static void RegisterCustomPlant<TBase>([NotNull] int id, [NotNull] GameObject prefab, [NotNull] GameObject preview,
            List<(int, int)> fusions, float attackInterval, float produceInterval, int attackDamage, int maxHealth, float cd, int sun)
            where TBase : Plant
        {
            prefab.AddComponent<TBase>().thePlantType = (PlantType)id;
            if (!CustomPlantTypes.Contains((PlantType)id))
            {
                CustomPlantTypes.Add((PlantType)id);
                CustomPlants.Add((PlantType)id, new CustomPlantData()
                {
                    ID = id,
                    Prefab = prefab,
                    Preview = preview,
                    PlantData = new()
                    {
                        attackDamage = attackDamage,
                        field_Public_PlantType_0 = (PlantType)id,
                        field_Public_Single_0 = attackInterval,
                        field_Public_Single_1 = produceInterval,
                        field_Public_Int32_0 = maxHealth,
                        field_Public_Single_2 = cd,
                        field_Public_Int32_1 = sun
                    }
                });
                foreach (var f in fusions)
                {
                    AddFusion(id, f.Item1, f.Item2);
                }
            }
            else
            {
                MelonLogger.Error($"Duplicate Plant ID: {id}");
            }
        }

        public static void RegisterCustomPlantClickEvent([NotNull] int id, [NotNull] Action<Plant> action) => CustomPlantClicks.Add((PlantType)id, action);

        public static void RegisterCustomSprite(int id, Sprite sprite) => CustomSprites.Add(id, sprite);

        public static void RegisterCustomUseItemOnPlantEvent([NotNull] PlantType id, [NotNull] BucketType bucketType, [NotNull] Action<Plant> callback) => CustomUseItems.Add((id, bucketType), callback);

        public static void RegisterCustomUseItemOnPlantEvent([NotNull] PlantType id, [NotNull] BucketType bucketType, [NotNull] PlantType newPlant)
            => CustomUseItems.Add((id, bucketType), (p) =>
            {
                p.Die();
                CreatePlant.Instance.SetPlant(p.thePlantColumn, p.thePlantRow, newPlant);
            });

        public static void RegisterCustomZombie<TBase, TClass>(int id, GameObject zombie, int spriteId,
            int theAttackDamage, int theMaxHealth, int theFirstArmorMaxHealth, int theSecondArmorMaxHealth)
            where TBase : Zombie where TClass : MonoBehaviour
        {
            zombie.AddComponent<TBase>().theZombieType = (ZombieType)id;
            zombie.AddComponent<TClass>();

            ZombieData.zombieData[id] = new()
            {
                theAttackDamage = theAttackDamage,
                theFirstArmorMaxHealth = theFirstArmorMaxHealth,
                theMaxHealth = theMaxHealth,
                theSecondArmorMaxHealth = theSecondArmorMaxHealth
            };
            CustomZombieTypes.Add((ZombieType)id);
            CustomZombies.Add(id, (zombie, spriteId));
        }

        public static void RegisterSuperSkill([NotNull] int id, [NotNull] Func<Plant, int> cost, [NotNull] Action<Plant> skill) => SuperSkills.Add((PlantType)id, (cost, skill));

        public static Dictionary<int, (PlantType, string, Func<bool>, int, string?)> CustomAdvancedBuffs { get; set; } = [];
        public static Dictionary<BulletType, GameObject> CustomBullets { get; set; } = [];
        public static Dictionary<int, string> CustomDebuffs { get; set; } = [];
        public static List<(int, int, int)> CustomFusions { get; set; } = [];
        public static Dictionary<int, GameObject> CustomParticles { get; set; } = [];
        public static Dictionary<PlantType, Action<Plant>> CustomPlantClicks { get; set; } = [];
        public static Dictionary<PlantType, CustomPlantData> CustomPlants { get; set; } = [];
        public static List<PlantType> CustomPlantTypes { get; set; } = [];
        public static Dictionary<int, Sprite> CustomSprites { get; set; } = [];
        public static Dictionary<int, (PlantType, string, int, string?)> CustomUltimateBuffs { get; set; } = [];
        public static Dictionary<(PlantType, BucketType), Action<Plant>> CustomUseItems { get; set; } = [];
        public static Dictionary<int, (GameObject, int)> CustomZombies { get; set; } = [];
        public static List<ZombieType> CustomZombieTypes { get; set; } = [];
        public static Dictionary<PlantType, (string, string)> PlantsAlmanac { get; set; } = [];
        public static Dictionary<PlantType, (Func<Plant, int>, Action<Plant>)> SuperSkills { get; set; } = [];
        public static Dictionary<ZombieType, (string, string)> ZombiesAlmanac { get; set; } = [];
    }
}