using CayTuyChinh;
using HarmonyLib;
using Il2Cpp;
using Il2CppInterop.Runtime.Injection;
using MelonLoader;
using UnityEngine;
using GiaoDienTuyChinh;

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

            string plantName = "Hướng Dương Lửa"; // Tên hiển thị
            string plantDescription =
                "Khi sản xuất ánh nắng sẽ đồng thời tạo một đường lửa trên cùng hàng.\n" + // Dòng tagline
                "Sản lượng nắng: <color=red>25 ánh nắng/15 giây</color>\n" + // Dòng sản lượng (dùng màu đỏ)
                "Công thức: <color=red>Hoa Hướng Dương + Ớt</color>\n\n" + // Dòng công thức (dùng màu đỏ) - Thêm \n\n để có dòng trống
                "Hướng Dương Lửa kết hợp khả năng sản xuất ánh nắng với sức mạnh của lửa, tạo ra đường lửa với sát thương 900 trên cùng hàng, gây sát thương liên tục cho tất cả zombie."; // Phần mô tả lore

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