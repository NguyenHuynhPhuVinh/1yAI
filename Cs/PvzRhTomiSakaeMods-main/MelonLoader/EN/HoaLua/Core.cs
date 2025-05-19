using CustomizeLib;
using HarmonyLib;
using Il2Cpp;
using Il2CppInterop.Runtime.Injection;
using MelonLoader;
using UnityEngine;

[assembly: MelonInfo(typeof(HoaLua.Core), "PvzRhTomiSakaeMods v1.0 - HoaLua", "1.0.0", "TomiSakae", null)]
[assembly: MelonGame("LanPiaoPiao", "PlantsVsZombiesRH")]
[assembly: MelonPlatformDomain(MelonPlatformDomainAttribute.CompatibleDomains.IL2CPP)]

namespace HoaLua
{
    [RegisterTypeInIl2Cpp] // Thuộc tính này cần thiết cho MelonLoader/Il2Cpp
    public class LopHoaLua : MonoBehaviour
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
        public const int HoaLuaPlantId = 2031;

        public override void OnInitializeMelon()
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;
            var ab = CustomCore.GetAssetBundle(MelonAssembly.Assembly, "hoalua");
            CustomCore.RegisterCustomPlant<Producer, LopHoaLua>(HoaLuaPlantId, ab.GetAsset<GameObject>("SunflowerPrefab"),
                ab.GetAsset<GameObject>("SunflowerPreview"), [(1, 16), (16, 1)], 0f, 15f, 0, 300, 15f, 175);
            
            string plantName = "Fire Sunflower"; // English name
            string plantDescription =
                "Creates a fire line on the same row when producing sun.\n" + // Tagline
                "Sun production: <color=red>25 sun/15 seconds</color>\n" + // Production info
                "Recipe: <color=red>Sunflower + Jalapeno</color>\n\n" + // Recipe info
                "Fire Sunflower combines sun production with fire power, creating a fire line with 900 damage on the same row, continuously damaging all zombies."; // Lore description

            CustomCore.AddPlantAlmanacStrings(HoaLuaPlantId, plantName, plantDescription);
        }
 
        // --- PATCH MỚI: TẠO LỬA KHI FIRESUNFLOWER TẠO SUN ---
        [HarmonyPatch(typeof(Producer), "ProduceSun")] // Patch vào cùng hàm
        public static class FireSunflower_ProduceSun_CreateFireLine_Patch
        {
            // Postfix chạy SAU khi ProduceSun gốc hoàn thành
            public static void Postfix(Producer __instance)
            {
                // Bước 1: Kiểm tra xem có phải là FireSunflower không
                if (__instance != null && __instance.thePlantType == (PlantType)HoaLuaPlantId)
                {
                    // Bước 2: Đảm bảo Board tồn tại
                    if (Board.Instance == null)
                    {
                        MelonLogger.Warning("[PvzRhTomiSakaeMods] FireSunflower Patch: Board.Instance là null, không thể tạo dòng lửa.");
                        return;
                    }

                    // Bước 3: Lấy dòng của cây
                    int plantRow = __instance.thePlantRow;

                    // Bước 4: Gọi hàm tạo lửa của Board
                    try
                    {
                        // Sử dụng các tham số mặc định của CreateFireLine hoặc tùy chỉnh nếu muốn
                        // CreateFireLine(int theFireRow, int damage = 1800, bool fromZombie = false, bool fix = false, bool shake = true)
                        Board.Instance.CreateFireLine(plantRow, 900, false, false, true); // Giữ damage mặc định, không phải từ zombie, không fix, có rung lắc
                    }
                    catch (Exception ex)
                    {
                        MelonLogger.Error("[PvzRhTomiSakaeMods] FireSunflower Patch: Lỗi khi gọi Board.CreateFireLine: {0}\n{1}", ex.Message, ex.StackTrace);
                    }
                }
            }
        }
    }
}
