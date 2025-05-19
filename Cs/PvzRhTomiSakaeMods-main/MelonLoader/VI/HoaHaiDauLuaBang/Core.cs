using CayTuyChinh;
using HarmonyLib;
using Il2Cpp;
using Il2CppInterop.Runtime.Injection;
using MelonLoader;
using UnityEngine;
using System;
using GiaoDienTuyChinh;

[assembly: MelonInfo(typeof(HoaHaiDauLuaBang.Core), "PvzRhTomiSakaeMods v1.0 - HoaHaiDauLuaBang", "1.0.0", "TomiSakae", null)]
[assembly: MelonGame("LanPiaoPiao", "PlantsVsZombiesRH")]
[assembly: MelonPlatformDomain(MelonPlatformDomainAttribute.CompatibleDomains.IL2CPP)]

namespace HoaHaiDauLuaBang
{
    [RegisterTypeInIl2Cpp] // Thuộc tính này cần thiết cho MelonLoader/Il2Cpp
    public class LopHoaHaiDauLuaBang : MonoBehaviour
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
        public const int HoaHaiDauLuaBangPlantId = 2035;
        public static float lastActivatedTime = 0f;
        public static int lastActivatedRow = -1;
        public static int secondFireRow = -1;
        public static int secondFreezeRow = -1;
        private static bool isRecursiveCall = false; // Biến tĩnh để theo dõi việc gọi lại

        public override void OnInitializeMelon()
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;
            var ab = CustomCore.GetAssetBundle(MelonAssembly.Assembly, "hoahaidauluabang");
            CustomCore.RegisterCustomPlant<Producer, LopHoaHaiDauLuaBang>(HoaHaiDauLuaBangPlantId, ab.GetAsset<GameObject>("TwinFlowerPrefab"),
                ab.GetAsset<GameObject>("TwinFlowerPreview"), [(2031, 2032), (2032, 2031)], 0f, 15f, 0, 300, 15f, 500);

            string plantName = "Hướng Dương Hai Đầu Lửa Băng"; // Tên hiển thị
            string plantDescription =
                "Tạo ra hai mặt trời mỗi lần sản xuất, tạo lửa và đóng băng zombie trên nhiều hàng.\n" + // Dòng tagline
                "Sản lượng nắng: <color=red>50 ánh nắng/15 giây</color>\n" + // Dòng sản lượng (dùng màu đỏ)
                "Công thức: <color=blue>Hướng Dương Lửa + Hướng Dương Băng</color>\n\n" + // Dòng công thức (dùng màu đỏ) - Thêm \n\n để có dòng trống
                "Hướng Dương Hai Đầu Lửa Băng kết hợp sức mạnh của lửa và băng, sản xuất gấp đôi ánh nắng và tạo hiệu ứng trên nhiều hàng. Có 30% cơ hội tác động đến cả 3 hàng cùng lúc, với lửa và băng được phân bố ngẫu nhiên giữa các hàng trên và dưới, tạo ra sự kết hợp mạnh mẽ giữa sát thương và làm chậm."; // Phần mô tả lore

            CustomCore.AddPlantAlmanacStrings(HoaHaiDauLuaBangPlantId, plantName, plantDescription);
        }

        // --- PATCH MỚI: TẠO LỬA, BĂNG VÀ THÊM MẶT TRỜI KHI DUAL FIREICESUNFLOWER TẠO SUN ---
        [HarmonyPatch(typeof(Producer), "ProduceSun")] // Patch vào cùng hàm
        public static class DualFireIceSunflower_ProduceSun_CreateEffects_Patch
        {
            // Postfix chạy SAU khi ProduceSun gốc hoàn thành
            public static void Postfix(Producer __instance)
            {
                // Bước 1: Kiểm tra xem có phải là DualFireIceSunflower không
                if (__instance != null && __instance.thePlantType == (PlantType)HoaHaiDauLuaBangPlantId)
                {
                    // Bước 2: Đảm bảo Board tồn tại
                    if (Board.Instance == null)
                    {
                        MelonLogger.Warning("[PvzRhTomiSakaeMods] DualFireIceSunflower Patch: Board.Instance là null, không thể tạo hiệu ứng.");
                        return;
                    }

                    // Bước 3: Lấy dòng của cây
                    int plantRow = __instance.thePlantRow;
                    int totalRows = Board.Instance.rowNum;

                    // Lưu lại hàng đã kích hoạt và thời gian
                    lastActivatedRow = plantRow;
                    lastActivatedTime = Time.time;

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
                        MelonLogger.Error("[PvzRhTomiSakaeMods] DualFireIceSunflower Patch: Lỗi khi tạo thêm mặt trời: {0}\n{1}", ex.Message, ex.StackTrace);
                    }

                    // Bước 5: Tạo hiệu ứng lửa và băng
                    try
                    {
                        // Tạo lửa ở hàng hiện tại
                        Board.Instance.CreateFireLine(plantRow, 1800, false, false, true);

                        // Tỉ lệ 30% tạo hiệu ứng trên cả 3 hàng (nếu có thể)
                        bool affectThreeRows = UnityEngine.Random.value <= 0.3f;
                        
                        if (affectThreeRows && plantRow > 0 && plantRow < totalRows - 1)
                        {
                            // Ngẫu nhiên quyết định hàng trên hoặc hàng dưới sẽ nhận hiệu ứng lửa
                            bool fireOnUpperRow = UnityEngine.Random.value > 0.5f;
                            
                            if (fireOnUpperRow)
                            {
                                // Tạo lửa ở hàng trên
                                Board.Instance.CreateFireLine(plantRow - 1, 1800, false, false, true);
                                
                                // Đóng băng zombie ở hàng dưới
                                int freezeRow = plantRow + 1;
                                secondFreezeRow = freezeRow; // Lưu lại hàng đã chọn cho hiệu ứng băng
                                
                                // Lặp qua tất cả zombie trong zombieArray để đóng băng zombie trên hàng đã chọn
                                foreach (Zombie zombie in Board.Instance.zombieArray)
                                {
                                    if (zombie == null) continue;
                                    
                                    // Xử lý zombie trên hàng đã chọn
                                    if (zombie.theZombieRow == freezeRow)
                                    {
                                        // Đóng băng zombie trong 10 giây
                                        zombie.SetFreeze(10f);
                                        
                                        // Tạo hiệu ứng băng tại vị trí zombie
                                        try
                                        {
                                            Vector3 zombiePos = zombie.transform.position;
                                            Board.Instance.CreateFreeze(zombiePos);
                                        }
                                        catch (Exception ex)
                                        {
                                            MelonLogger.Warning("[PvzRhTomiSakaeMods] DualFireIceSunflower: Không thể tạo hiệu ứng băng: {0}", ex.Message);
                                        }
                                    }
                                }
                            }
                            else
                            {
                                // Tạo lửa ở hàng dưới
                                Board.Instance.CreateFireLine(plantRow + 1, 1800, false, false, true);
                                
                                // Đóng băng zombie ở hàng trên
                                int freezeRow = plantRow - 1;
                                secondFreezeRow = freezeRow; // Lưu lại hàng đã chọn cho hiệu ứng băng
                                
                                // Lặp qua tất cả zombie trong zombieArray để đóng băng zombie trên hàng đã chọn
                                foreach (Zombie zombie in Board.Instance.zombieArray)
                                {
                                    if (zombie == null) continue;
                                    
                                    // Xử lý zombie trên hàng đã chọn
                                    if (zombie.theZombieRow == freezeRow)
                                    {
                                        // Đóng băng zombie trong 10 giây
                                        zombie.SetFreeze(10f);
                                        
                                        // Tạo hiệu ứng băng tại vị trí zombie
                                        try
                                        {
                                            Vector3 zombiePos = zombie.transform.position;
                                            Board.Instance.CreateFreeze(zombiePos);
                                        }
                                        catch (Exception ex)
                                        {
                                            MelonLogger.Warning("[PvzRhTomiSakaeMods] DualFireIceSunflower: Không thể tạo hiệu ứng băng: {0}", ex.Message);
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            // Ngẫu nhiên chọn hàng trên hoặc hàng dưới cho hiệu ứng băng
                            bool useUpperRow = UnityEngine.Random.value > 0.5f;
                            int secondRow = -1;

                            if (useUpperRow && plantRow > 0)
                            {
                                secondRow = plantRow - 1;
                            }
                            else if (!useUpperRow && plantRow < totalRows - 1)
                            {
                                secondRow = plantRow + 1;
                            }
                            else
                            {
                                // Nếu không thể chọn hàng theo ý muốn, chọn hàng khả dụng
                                if (plantRow > 0)
                                {
                                    secondRow = plantRow - 1;
                                }
                                else if (plantRow < totalRows - 1)
                                {
                                    secondRow = plantRow + 1;
                                }
                            }

                            secondFreezeRow = secondRow; // Lưu lại hàng thứ hai đã chọn cho hiệu ứng băng

                            // Lặp qua tất cả zombie trong zombieArray để đóng băng zombie trên hàng thứ hai
                            foreach (Zombie zombie in Board.Instance.zombieArray)
                            {
                                if (zombie == null) continue;

                                // Xử lý zombie trên hàng thứ hai
                                if (zombie.theZombieRow == secondRow)
                                {
                                    // Đóng băng zombie trong 10 giây
                                    zombie.SetFreeze(10f);

                                    // Tạo hiệu ứng băng tại vị trí zombie
                                    try
                                    {
                                        Vector3 zombiePos = zombie.transform.position;
                                        Board.Instance.CreateFreeze(zombiePos);
                                    }
                                    catch (Exception ex)
                                    {
                                        MelonLogger.Warning("[PvzRhTomiSakaeMods] DualFireIceSunflower: Không thể tạo hiệu ứng băng: {0}", ex.Message);
                                    }
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        MelonLogger.Error("[PvzRhTomiSakaeMods] DualFireIceSunflower Patch: Lỗi khi tạo hiệu ứng: {0}\n{1}", ex.Message, ex.StackTrace);
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
                // Nếu không phải do Hoa Hai Đầu Lửa Băng gọi (thời gian > 0.1s), cho phép chạy bình thường
                if (Time.time - lastActivatedTime > 0.1f)
                {
                    return true; // Cho phép phương thức gốc chạy
                }

                // Nếu là do Hoa Hai Đầu Lửa Băng gọi, chỉ cho phép đóng băng zombie trên các hàng đã chọn
                int zombieRow = __instance.theZombieRow;

                // Cho phép đóng băng zombie trên hàng thứ hai đã chọn cho hiệu ứng băng
                if (zombieRow == secondFreezeRow)
                {
                    return true;
                }

                // Không cho phép đóng băng zombie ở các hàng khác
                return false;
            }
        }
    }
}
