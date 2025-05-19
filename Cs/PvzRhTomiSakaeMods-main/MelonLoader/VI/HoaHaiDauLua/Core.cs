using CayTuyChinh;
using HarmonyLib;
using Il2Cpp;
using Il2CppInterop.Runtime.Injection;
using MelonLoader;
using UnityEngine;
using System;
using GiaoDienTuyChinh;

[assembly: MelonInfo(typeof(HoaHaiDauLua.Core), "PvzRhTomiSakaeMods v1.0 - HoaHaiDauLua", "1.0.0", "TomiSakae", null)]
[assembly: MelonGame("LanPiaoPiao", "PlantsVsZombiesRH")]
[assembly: MelonPlatformDomain(MelonPlatformDomainAttribute.CompatibleDomains.IL2CPP)]

namespace HoaHaiDauLua
{
    [RegisterTypeInIl2Cpp] // Thuộc tính này cần thiết cho MelonLoader/Il2Cpp
    public class LopHoaHaiDauLua : MonoBehaviour
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
        public const int HoaHaiDauLuaPlantId = 2033;
        private static bool isRecursiveCall = false; // Biến tĩnh để theo dõi việc gọi lại

        public override void OnInitializeMelon()
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;
            var ab = CustomCore.GetAssetBundle(MelonAssembly.Assembly, "hoahaidaulua");
            CustomCore.RegisterCustomPlant<Producer, LopHoaHaiDauLua>(HoaHaiDauLuaPlantId, ab.GetAsset<GameObject>("TwinFlowerPrefab"),
                ab.GetAsset<GameObject>("TwinFlowerPreview"), [(2031, 2031), (2031, 2031)], 0f, 15f, 0, 300, 15f, 350);

            string plantName = "Hướng Dương Hai Đầu Lửa"; // Tên hiển thị
            string plantDescription =
                "Tạo ra hai mặt trời mỗi lần sản xuất và tạo lửa trên nhiều hàng.\n" + // Dòng tagline
                "Sản lượng nắng: <color=red>50 ánh nắng/15 giây</color>\n" + // Dòng sản lượng (dùng màu đỏ)
                "Công thức: <color=red>Hướng Dương Lửa + Hướng Dương Lửa</color>\n\n" + // Dòng công thức (dùng màu đỏ) - Thêm \n\n để có dòng trống
                "Hướng Dương Hai Đầu Lửa sản xuất gấp đôi ánh nắng và tạo đường lửa với 1800 sát thương trên hàng hiện tại và các hàng lân cận. Có 30% cơ hội tạo lửa trên cả 3 hàng cùng lúc, tạo ra vùng sát thương rộng lớn để đốt cháy nhiều zombie."; // Phần mô tả lore

            CustomCore.AddPlantAlmanacStrings(HoaHaiDauLuaPlantId, plantName, plantDescription);
        }

        // --- PATCH MỚI: TẠO LỬA VÀ THÊM MẶT TRỜI KHI DUAL FIRESUNFLOWER TẠO SUN ---
        [HarmonyPatch(typeof(Producer), "ProduceSun")] // Patch vào cùng hàm
        public static class DualFireSunflower_ProduceSun_CreateFireLine_Patch
        {
            // Postfix chạy SAU khi ProduceSun gốc hoàn thành
            public static void Postfix(Producer __instance)
            {
                // Bước 1: Kiểm tra xem có phải là DualFireSunflower không
                if (__instance != null && __instance.thePlantType == (PlantType)HoaHaiDauLuaPlantId)
                {
                    // Bước 2: Đảm bảo Board tồn tại
                    if (Board.Instance == null)
                    {
                        MelonLogger.Warning("[PvzRhTomiSakaeMods] DualFireSunflower Patch: Board.Instance là null, không thể tạo dòng lửa.");
                        return;
                    }

                    // Bước 3: Lấy dòng của cây
                    int plantRow = __instance.thePlantRow;
                    int totalRows = Board.Instance.rowNum;

                    // Bước 4: Tạo thêm một mặt trời
                    try
                    {
                        // Gọi lại phương thức ProduceSun của Producer để tạo mặt trời thứ hai
                        // Lưu ý: Điều này có thể gây ra đệ quy vô hạn nếu không xử lý cẩn thận
                        // Chúng ta cần đảm bảo rằng chỉ gọi lại ProduceSun một lần
                        if (!isRecursiveCall)
                        {
                            isRecursiveCall = true;
                            __instance.ProduceSun(); // Gọi lại phương thức ProduceSun
                            isRecursiveCall = false;
                        }
                    }
                    catch (Exception ex)
                    {
                        MelonLogger.Error("[PvzRhTomiSakaeMods] DualFireSunflower Patch: Lỗi khi tạo thêm mặt trời: {0}\n{1}", ex.Message, ex.StackTrace);
                    }

                    // Bước 5: Gọi hàm tạo lửa của Board cho hàng hiện tại
                    try
                    {
                        // Tạo lửa ở hàng hiện tại
                        Board.Instance.CreateFireLine(plantRow, 1800, false, false, true);

                        // Tỉ lệ 30% tạo lửa ở cả 3 hàng (nếu có thể)
                        bool createThreeLines = UnityEngine.Random.value <= 0.3f;
                        
                        if (createThreeLines && plantRow > 0 && plantRow < totalRows - 1)
                        {
                            // Tạo lửa ở cả hàng trên và hàng dưới
                            Board.Instance.CreateFireLine(plantRow - 1, 1800, false, false, true);
                            Board.Instance.CreateFireLine(plantRow + 1, 1800, false, false, true);
                        }
                        else
                        {
                            // Ngẫu nhiên chọn hàng trên hoặc hàng dưới
                            bool useUpperRow = UnityEngine.Random.value > 0.5f;

                            if (useUpperRow && plantRow > 0)
                            {
                                // Tạo lửa ở hàng trên
                                Board.Instance.CreateFireLine(plantRow - 1, 1800, false, false, true);
                            }
                            else if (!useUpperRow && plantRow < totalRows - 1)
                            {
                                // Tạo lửa ở hàng dưới
                                Board.Instance.CreateFireLine(plantRow + 1, 1800, false, false, true);
                            }
                            else
                            {
                                // Nếu không thể tạo ở hàng đã chọn (vì đã ở hàng đầu hoặc cuối), tạo ở hàng còn lại
                                if (plantRow > 0)
                                {
                                    Board.Instance.CreateFireLine(plantRow - 1, 1800, false, false, true);
                                }
                                else if (plantRow < totalRows - 1)
                                {
                                    Board.Instance.CreateFireLine(plantRow + 1, 1800, false, false, true);
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        MelonLogger.Error("[PvzRhTomiSakaeMods] DualFireSunflower Patch: Lỗi khi gọi Board.CreateFireLine: {0}\n{1}", ex.Message, ex.StackTrace);
                    }
                }
            }
        }
    }
}
