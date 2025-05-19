using CustomizeLib;
using HarmonyLib;
using Il2Cpp;
using Il2CppInterop.Runtime.Injection;
using MelonLoader;
using UnityEngine;
using System;

[assembly: MelonInfo(typeof(HoaBang.Core), "PvzRhTomiSakaeMods v1.0 - HoaBang", "1.0.0", "TomiSakae", null)]
[assembly: MelonGame("LanPiaoPiao", "PlantsVsZombiesRH")]
[assembly: MelonPlatformDomain(MelonPlatformDomainAttribute.CompatibleDomains.IL2CPP)]

namespace HoaBang
{
    [RegisterTypeInIl2Cpp] // Thuộc tính này cần thiết cho MelonLoader/Il2Cpp
    public class LopHoaBang : MonoBehaviour
    {
        public Producer plant
        {
            get
            {
                return base.gameObject.GetComponent<Producer>();
            }
        }
    }
    public class Core : MelonMod
    {
        public const int HoaBangPlantId = 2032;
        public static float lastActivatedTime = 0f;
        public static int lastActivatedRow = -1;

        public override void OnInitializeMelon()
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;
            var ab = CustomCore.GetAssetBundle(MelonAssembly.Assembly, "hoabang");
            CustomCore.RegisterCustomPlant<Producer, LopHoaBang>(HoaBangPlantId, ab.GetAsset<GameObject>("SunflowerPrefab"),
                ab.GetAsset<GameObject>("SunflowerPreview"), [(1, 10), (10, 1)], 0f, 15f, 0, 300, 15f, 200);
            
            string plantName = "Ice Sunflower"; // English name
            string plantDescription =
                "Freezes all zombies on the same row when producing sun.\n" + // Tagline
                "Sun production: <color=blue>25 sun/15 seconds</color>\n" + // Production info
                "Recipe: <color=blue>Sunflower + Ice-shroom</color>\n\n" + // Recipe info
                "Ice Sunflower combines sun production with freezing power, freezing all zombies on the same row for 5 seconds, slowing down enemies and creating time for other plants to attack."; // Lore description

            CustomCore.AddPlantAlmanacStrings(HoaBangPlantId, plantName, plantDescription);
        }
 
        // --- PATCH MỚI: ĐÓNG BĂNG ZOMBIE KHI ICESUNFLOWER TẠO SUN ---
        [HarmonyPatch(typeof(Producer), "ProduceSun")] // Patch vào cùng hàm
        public static class IceSunflower_ProduceSun_FreezeZombies_Patch
        {
            // Postfix chạy SAU khi ProduceSun gốc hoàn thành
            public static void Postfix(Producer __instance)
            {
                // Bước 1: Kiểm tra xem có phải là IceSunflower không
                if (__instance != null && __instance.thePlantType == (PlantType)HoaBangPlantId)
                {
                    // Bước 2: Đảm bảo Board tồn tại
                    if (Board.Instance == null)
                    {
                        MelonLogger.Warning("[PvzRhTomiSakaeMods] IceSunflower Patch: Board.Instance là null, không thể đóng băng zombie.");
                        return;
                    }

                    // Bước 3: Lấy dòng của cây
                    int plantRow = __instance.thePlantRow;
                    
                    // Lưu lại hàng đã kích hoạt và thời gian
                    lastActivatedRow = plantRow;
                    lastActivatedTime = Time.time;

                    // Bước 4: Đóng băng tất cả zombie trên cùng hàng
                    try
                    {
                        int zombiesCount = 0;

                        // Lặp qua tất cả zombie trong zombieArray
                        foreach (Zombie zombie in Board.Instance.zombieArray)
                        {
                            if (zombie == null) continue;

                            // Xử lý zombie dựa trên hàng
                            if (zombie.theZombieRow == plantRow)
                            {
                                // Đóng băng zombie trên cùng hàng với cây
                                zombiesCount++;
                                
                                // Đóng băng zombie trong 5 giây
                                zombie.SetFreeze(5f);
                                
                                // Tạo hiệu ứng băng tại vị trí zombie
                                try
                                {
                                    Vector3 zombiePos = zombie.transform.position;
                                    Board.Instance.CreateFreeze(zombiePos);
                                }
                                catch (Exception ex)
                                {
                                    MelonLogger.Warning("[PvzRhTomiSakaeMods] IceSunflower: Không thể tạo hiệu ứng băng: {0}", ex.Message);
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        MelonLogger.Error("[PvzRhTomiSakaeMods] IceSunflower Patch: Lỗi khi đóng băng zombie: {0}\n{1}", ex.Message, ex.StackTrace);
                    }
                }
            }
        }

        // --- PATCH MỚI: CHẶN HIỆU ỨNG ĐÓNG BĂNG CHO ZOMBIE Ở HÀNG KHÁC ---
        [HarmonyPatch(typeof(Zombie), "SetFreeze")]
        public static class Zombie_SetFreeze_Patch
        {
            // Prefix chạy TRƯỚC khi SetFreeze gốc chạy
            // Trả về false để ngăn phương thức gốc chạy
            public static bool Prefix(Zombie __instance, float time)
            {
                // Nếu không phải do Hoa Băng gọi (thời gian > 0.1s), cho phép chạy bình thường
                if (Time.time - lastActivatedTime > 0.1f)
                {
                    return true; // Cho phép phương thức gốc chạy
                }

                // Nếu là do Hoa Băng gọi, chỉ cho phép đóng băng zombie trên cùng hàng
                int zombieRow = __instance.theZombieRow;
                int plantRow = lastActivatedRow;

                // Nếu zombie không nằm trên cùng hàng với cây Hoa Băng, chặn hiệu ứng đóng băng
                if (zombieRow != plantRow)
                {
                    return false; // Không cho phép phương thức gốc chạy
                }

                // Cho phép đóng băng zombie trên cùng hàng
                return true;
            }
        }
    }
}
